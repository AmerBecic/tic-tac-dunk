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
type Failure = Extract<MatchActionResponse, { success: false }>;
const fail = (code: Failure['code'], error: string): Failure => ({
  success: false,
  code,
  error,
});
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
): Promise<Failure | { correct: boolean }> {
  const index = input.row * 3 + input.column;
  if (match.board[index]) return fail('INVALID_ACTION', 'Cell is occupied.');
  const player = await playerRepository.findPlayer(input.playerId, db);
  if (player.error)
    throw new Error(`Player lookup failed: ${player.error.message}`);
  if (!player.data) return fail('INVALID_ACTION', 'Player not found.');
  const result = await answerService.validateGridAnswer(match.grid, input, db);
  if (!result) return fail('INVALID_ACTION', 'Player not found.');
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
    } else if (match.board.every(Boolean)) {
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
): Failure | null {
  if (match.mode !== 'ONLINE')
    return fail(
      'INVALID_ACTION',
      'Draw offers are only available in PvP matches.'
    );
  const offer = pendingDraw(match);
  if (action === 'OFFER_DRAW') {
    if (offer)
      return fail('INVALID_ACTION', 'A draw offer is already pending.');
  } else {
    if (!offer || offer === actor)
      return fail(
        'INVALID_ACTION',
        'No draw offer from the opponent is pending.'
      );
    if (action === 'ACCEPT_DRAW') finish(match, 'DRAW', null);
  }
  return null;
}

async function chooseAiAction(
  match: Match,
  expectedVersion: number,
  db: ReturnType<typeof createSupabase>
): Promise<MatchActionRequest> {
  const skip: MatchActionRequest = { action: 'SKIP', expectedVersion };
  if (Math.random() >= 0.5) return skip;
  const { data, error } = await gridRepository.findGridAnswers(match.grid, db);
  if (error) throw new Error(`AI answer lookup failed: ${error.message}`);
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
): Promise<MatchActionResponse> {
  const found = await ticTacToeRepository.findMatchById(id, db);
  if (found.error)
    throw new Error(`Match lookup failed: ${found.error.message}`);
  const match = found.data;
  if (!match || (match.player1Id !== userId && match.player2Id !== userId)) {
    return fail('NOT_FOUND', 'Match not found.');
  }
  if (match.version !== input.expectedVersion)
    return fail('CONFLICT', 'Match changed. Refresh and try again.');
  if (match.status !== 'ACTIVE')
    return fail('INVALID_ACTION', 'Match is not active.');
  if (match.mode === 'ONLINE' && !match.player2Id)
    return fail('INVALID_ACTION', 'Match has no opponent.');
  const isAiAction = input.action === 'AI_TURN';
  if (isAiAction) {
    if (
      match.mode !== 'AI' ||
      match.player1Id !== userId ||
      match.currentPlayer !== 'PLAYER2'
    ) {
      return fail('INVALID_ACTION', 'It is not the AI turn.');
    }
    const remaining = match.turnEndsAt
      ? Date.parse(match.turnEndsAt) - Date.now()
      : 0;
    if (!Number.isFinite(remaining) || remaining <= 0 || remaining > 15000) {
      return fail('CONFLICT', 'AI turn is outside its action window.');
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
      return fail('INVALID_ACTION', 'It is not your turn.');
    if (!match.turnEndsAt || Date.parse(match.turnEndsAt) <= Date.now()) {
      return fail('CONFLICT', 'Turn deadline has passed.');
    }
  }
  if (
    input.action === 'TIMEOUT' &&
    (!match.currentPlayer ||
      !match.turnEndsAt ||
      !Number.isFinite(Date.parse(match.turnEndsAt)) ||
      Date.parse(match.turnEndsAt) > Date.now())
  ) {
    return fail('CONFLICT', 'Turn has not expired.');
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
      if ('success' in result) return result;
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
      return fail('INVALID_ACTION', 'Invalid AI action.');
    default: {
      const error = handleDraw(match, input.action, actor);
      if (error) return error;
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
    throw new Error(`Match update failed: ${saved.error.message}`);
  if (!saved.data)
    return fail(
      'CONFLICT',
      'Match changed or turn expired. Refresh and try again.'
    );
  return {
    success: true,
    data: saved.data,
    ...(correct === undefined ? {} : { correct }),
  };
}

export const matchActionService = { applyAction };
