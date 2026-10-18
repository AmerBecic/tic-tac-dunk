import { AppError } from '@/server/errors/app.error';
import { AppErrorType } from '@/server/types/app-error.types';
import { gridRepository } from '@/server/grid/repositories/grid.repository';
import 'server-only';
import type { createSupabase } from '@/core/supabase/server';
import type { Match } from '@/domains/tic-tac-toe/types/match.types';
import type { MatchActionRequest } from '@/domains/tic-tac-toe/types/match.action.request.dto';
import type { MatchActionResponse } from '@/domains/tic-tac-toe/types/match.action.response.dto';
import { answerService } from '@/server/grid/services/answer.service';
import { playerRepository } from '@/server/player/repositories/player.repository';
import { ticTacToeRepository } from '../repositories/tic-tac-toe.repository';

type Actor = NonNullable<Match['currentPlayer']>;
const opponent = (actor: Actor): Actor =>
  actor === 'PLAYER1' ? 'PLAYER2' : 'PLAYER1';

function finish(
  match: Match,
  reason: NonNullable<Match['endReason']>,
  winner: Match['winner']
) {
  match.status = 'FINISHED';
  match.endReason = reason;
  match.winner = winner;
  match.finishedAt = new Date().toISOString();
  match.currentPlayer = null;
  match.turnEndsAt = null;
}

function nextTurn(match: Match, actor: Actor) {
  match.currentPlayer = opponent(actor);
  match.turnNumber += 1;
  match.turnEndsAt = new Date(
    Date.now() + match.turnDurationSeconds * 1000
  ).toISOString();
}

function pendingDraw(match: Match): Actor | null {
  for (let i = match.history.length - 1; i >= 0; i--) {
    const event = match.history[i];
    if (event.action === 'OFFER_DRAW') return event.actor;
    if (
      [
        'MOVE',
        'SKIP',
        'TIMEOUT',
        'DECLINE_DRAW',
        'ACCEPT_DRAW',
        'FORFEIT',
      ].includes(event.action)
    )
      return null;
  }
  return null;
}

async function submitMove(
  match: Match,
  input: Extract<MatchActionRequest, { action: 'MOVE' }>,
  actor: Actor,
  db: ReturnType<typeof createSupabase>
): Promise<{ correct: boolean }> {
  const index = input.row * 3 + input.column;
  if (match.board[index])
    throw new AppError(
      'Cell is occupied.',
      'INVALID_ACTION',
      AppErrorType.VALIDATION
    );
  const player = await playerRepository.findPlayer(input.playerId, db);
  if (player.error)
    throw new AppError(
      'Unable to load player',
      'PLAYER_LOAD_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: player.error }
    );
  if (!player.data)
    throw new AppError(
      'Player not found.',
      'INVALID_ACTION',
      AppErrorType.VALIDATION
    );
  const result = await answerService.validateGridAnswer(match.grid, input, db);
  if (result.correct) {
    match.board[index] = {
      owner: actor,
      nbaPlayerId: player.data.id,
      playerName: player.data.name,
      jerseyColor: 'jerseyColor' in result ? result.jerseyColor : undefined,
      trimColor: 'trimColor' in result ? result.trimColor : undefined,
    };
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    if (
      lines.some((line) =>
        line.every((cell) => match.board[cell]?.owner === actor)
      )
    ) {
      finish(match, 'THREE_IN_ROW', actor);
    } else if (
      lines.every(
        (line) =>
          line.some((cell) => match.board[cell]?.owner === 'PLAYER1') &&
          line.some((cell) => match.board[cell]?.owner === 'PLAYER2')
      )
    ) {
      finish(match, 'DRAW', null);
    }
  }
  if (match.status === 'ACTIVE') nextTurn(match, actor);
  return { correct: result.correct };
}

function forfeitMatch(match: Match, actor: Actor) {
  finish(match, 'FORFEIT', opponent(actor));
}

function skipTurn(match: Match, actor: Actor) {
  nextTurn(match, actor);
}

function handleDraw(
  match: Match,
  action: 'OFFER_DRAW' | 'ACCEPT_DRAW' | 'DECLINE_DRAW',
  actor: Actor
): void {
  if (match.mode !== 'ONLINE')
    throw new AppError(
      'Draw offers are only available in PvP matches.',
      'INVALID_ACTION',
      AppErrorType.VALIDATION
    );
  const offer = pendingDraw(match);
  if (action === 'OFFER_DRAW') {
    if (offer)
      throw new AppError(
        'A draw offer is already pending.',
        'INVALID_ACTION',
        AppErrorType.VALIDATION
      );
  } else {
    if (!offer || offer === actor)
      throw new AppError(
        'No draw offer from the opponent is pending.',
        'INVALID_ACTION',
        AppErrorType.VALIDATION
      );
    if (action === 'ACCEPT_DRAW') finish(match, 'DRAW', null);
  }
}

async function chooseAiAction(
  match: Match,
  expectedVersion: number,
  db: ReturnType<typeof createSupabase>
): Promise<MatchActionRequest> {
  const skip: MatchActionRequest = { action: 'SKIP', expectedVersion };
  if (Math.random() >= 0.5) return skip;
  const { data, error } = await gridRepository.findGridAnswers(match.grid, db);
  if (error)
    throw new AppError(
      'Unable to find AI answers',
      'AI_ANSWER_LOOKUP_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: error }
    );
  const cells = data.filter(
    (cell) =>
      cell.player_id && !match.board[cell.row_index * 3 + cell.column_index]
  );
  if (!cells.length) return skip;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const completes = (index: number, owner: Actor) =>
    lines.some(
      (line) =>
        line.includes(index) &&
        line.every((i) => i === index || match.board[i]?.owner === owner)
    );
  const winning = cells.filter((cell) =>
    completes(cell.row_index * 3 + cell.column_index, 'PLAYER2')
  );
  const blocking = cells.filter((cell) =>
    completes(cell.row_index * 3 + cell.column_index, 'PLAYER1')
  );
  const choices = winning.length ? winning : blocking.length ? blocking : cells;
  const cell = choices[Math.floor(Math.random() * choices.length)];
  return {
    action: 'MOVE',
    expectedVersion,
    row: cell.row_index,
    column: cell.column_index,
    playerId: cell.player_id!,
  };
}

async function applyAction(
  id: string,
  input: MatchActionRequest,
  userId: string,
  db: ReturnType<typeof createSupabase>
): Promise<Extract<MatchActionResponse, { success: true }>> {
  const found = await ticTacToeRepository.findMatchById(id, db);
  if (found.error)
    throw new AppError(
      'Unable to load match',
      'MATCH_LOAD_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: found.error }
    );
  const match = found.data;
  if (!match || (match.player1Id !== userId && match.player2Id !== userId)) {
    throw new AppError('Match not found.', 'NOT_FOUND', AppErrorType.NOT_FOUND);
  }
  if (match.version !== input.expectedVersion)
    throw new AppError(
      'Match changed. Refresh and try again.',
      'CONFLICT',
      AppErrorType.CONFLICT
    );
  if (match.status !== 'ACTIVE')
    throw new AppError(
      'Match is not active.',
      'INVALID_ACTION',
      AppErrorType.VALIDATION
    );
  if (match.mode === 'ONLINE' && !match.player2Id)
    throw new AppError(
      'Match has no opponent.',
      'INVALID_ACTION',
      AppErrorType.VALIDATION
    );
  const isAiAction = input.action === 'AI_TURN';
  if (isAiAction) {
    if (
      match.mode !== 'AI' ||
      match.player1Id !== userId ||
      match.currentPlayer !== 'PLAYER2'
    ) {
      throw new AppError(
        'It is not the AI turn.',
        'INVALID_ACTION',
        AppErrorType.VALIDATION
      );
    }
    const remaining = match.turnEndsAt
      ? Date.parse(match.turnEndsAt) - Date.now()
      : 0;
    if (!Number.isFinite(remaining) || remaining <= 0 || remaining > 15000) {
      throw new AppError(
        'AI turn is outside its action window.',
        'CONFLICT',
        AppErrorType.CONFLICT
      );
    }
    input = await chooseAiAction(match, input.expectedVersion, db);
  }
  const actor: Actor = isAiAction
    ? 'PLAYER2'
    : match.player1Id === userId
      ? 'PLAYER1'
      : 'PLAYER2';
  const turnAction = input.action === 'MOVE' || input.action === 'SKIP';
  if (turnAction) {
    if (match.currentPlayer !== actor)
      throw new AppError(
        'It is not your turn.',
        'INVALID_ACTION',
        AppErrorType.VALIDATION
      );
    if (!match.turnEndsAt || Date.parse(match.turnEndsAt) <= Date.now()) {
      throw new AppError(
        'Turn deadline has passed.',
        'CONFLICT',
        AppErrorType.CONFLICT
      );
    }
  }
  if (
    input.action === 'TIMEOUT' &&
    (!match.currentPlayer ||
      !match.turnEndsAt ||
      !Number.isFinite(Date.parse(match.turnEndsAt)) ||
      Date.parse(match.turnEndsAt) > Date.now())
  ) {
    throw new AppError(
      'Turn has not expired.',
      'CONFLICT',
      AppErrorType.CONFLICT
    );
  }
  const event: Match['history'][number] = {
    action: input.action,
    actor: input.action === 'TIMEOUT' ? match.currentPlayer! : actor,
    turnNumber: match.turnNumber,
    at: new Date().toISOString(),
  };
  let correct: boolean | undefined;
  switch (input.action) {
    case 'MOVE': {
      const result = await submitMove(match, input, actor, db);
      correct = result.correct;
      Object.assign(event, {
        row: input.row,
        column: input.column,
        playerId: input.playerId,
        correct,
      });
      break;
    }
    case 'TIMEOUT':
      skipTurn(match, match.currentPlayer!);
      break;
    case 'SKIP':
      skipTurn(match, actor);
      break;
    case 'FORFEIT':
      forfeitMatch(match, actor);
      break;
    case 'AI_TURN':
      throw new AppError(
        'Invalid AI action.',
        'INVALID_ACTION',
        AppErrorType.VALIDATION
      );
    default: {
      handleDraw(match, input.action, actor);
    }
  }
  match.history.push(event);
  const saved = await ticTacToeRepository.saveAction(
    match,
    input.expectedVersion,
    db,
    turnAction ? 'live' : input.action === 'TIMEOUT' ? 'expired' : null
  );
  if (saved.error)
    throw new AppError(
      'Unable to update match',
      'MATCH_UPDATE_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: saved.error }
    );
  if (!saved.data)
    throw new AppError(
      'Match changed or turn expired. Refresh and try again.',
      'CONFLICT',
      AppErrorType.CONFLICT
    );
  return {
    success: true,
    data: saved.data,
    ...(correct === undefined ? {} : { correct }),
  };
}

export const matchActionService = { applyAction };
