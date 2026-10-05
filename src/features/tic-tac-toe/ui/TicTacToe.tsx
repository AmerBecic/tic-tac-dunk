'use client';

import { useEffect, useRef, useState } from 'react';

import { useGetActiveAiMatch } from '@/domains/tic-tac-toe/hooks/useGetActiveAiMatch';
import { useMatchActions } from '@/domains/tic-tac-toe/hooks/useMatchActions';
import { useTranslations } from 'next-intl';
import { Grid, GridCell } from '@/features/shared/grid';
import { FlipTile } from '@/features/shared/flip-tile';
import { Logo } from '@/features/shared/logo';
import { Paragraph } from '@/features/shared/ui/paragraph';
import { useAiTurn } from '../hooks/useAiTurn';
import styles from './TicTacToe.module.scss';

export const TicTacToe = () => {
  const t = useTranslations('playersSearch');
  const turnText = useTranslations('ticTacToe');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const { activeAiMatch } = useGetActiveAiMatch();
  const {
    submitMove,
    playAiTurn,
    expireTurn,
    isPending,
    data: actionResult,
  } = useMatchActions(activeAiMatch?.id ?? '');
  const savedMatch = actionResult?.data;
  const match =
    savedMatch &&
    (!activeAiMatch ||
      (savedMatch.id === activeAiMatch.id &&
        savedMatch.version >= activeAiMatch.version))
      ? savedMatch
      : activeAiMatch;

  useAiTurn({ match, now, isPending, playAiTurn });

  const deadline = match?.turnEndsAt ? Date.parse(match.turnEndsAt) : null;
  const secondsLeft =
    deadline !== null && Number.isFinite(deadline)
      ? Math.max(0, Math.ceil((deadline - now) / 1000))
      : 0;
  const timeoutAttempt = useRef({ pending: false, tick: 0, completed: '' });
  useEffect(() => {
    if (
      !match ||
      match.status !== 'ACTIVE' ||
      !match.currentPlayer ||
      deadline === null ||
      !Number.isFinite(deadline) ||
      secondsLeft > 0 ||
      isPending
    )
      return;
    const key = `${match.id}:${match.version}`;
    const attempt = timeoutAttempt.current;
    if (attempt.pending || attempt.tick === now || attempt.completed === key)
      return;
    attempt.pending = true;
    attempt.tick = now;
    void expireTurn({ expectedVersion: match.version })
      .then(() => {
        attempt.completed = key;
      })
      .catch(() => {})
      .finally(() => {
        attempt.pending = false;
      });
  }, [secondsLeft, now, match, deadline, isPending, expireTurn]);

  if (!match) return null;

  const timeLeft = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const turnLabel =
    match.status === 'WAITING'
      ? turnText('waiting')
      : match.status !== 'ACTIVE'
        ? turnText('finished')
        : match.currentPlayer === 'PLAYER1'
          ? turnText('yourTurn')
          : turnText('aiTurn');

  return (
    <>
      <Paragraph>
        <span role="status">{turnLabel}</span>
        {match.status === 'ACTIVE' && match.currentPlayer && (
          <>
            {' '}
            ·{' '}
            <span role="timer" aria-live="off">
              {turnText('timeLeft', { time: timeLeft })}
            </span>
            {secondsLeft === 0 && (
              <span role="status"> · {turnText('timeExpired')}</span>
            )}
          </>
        )}
      </Paragraph>
      <Grid
        rows={match.grid.rows}
        columns={match.grid.columns}
        corner={
          <FlipTile
            className={styles.titleTile}
            isFlipped={false}
            front={
              <>
                <Logo showLabel={false} />
                <Paragraph className={styles.title}>PvE</Paragraph>
              </>
            }
            back={null}
          />
        }
        renderCell={(row, column) => {
          const answer = match.board[row * match.grid.columns.length + column];
          const canMove =
            match.status === 'ACTIVE' &&
            match.currentPlayer === 'PLAYER1' &&
            secondsLeft > 0;
          return (
            <GridCell
              answer={answer ?? undefined}
              mark={
                answer ? (answer.owner === 'PLAYER1' ? 'X' : 'O') : undefined
              }
              disabled={isPending || !canMove || !!answer}
              emptyLabel={t('search')}
              onSelectPlayer={async (player) => {
                if (isPending || !canMove || answer) return;
                await submitMove({
                  row,
                  column,
                  playerId: player.id,
                  expectedVersion: match.version,
                });
              }}
            />
          );
        }}
      />
    </>
  );
};
