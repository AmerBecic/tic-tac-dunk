'use client';

import { useEffect, useRef } from 'react';
import type { Match } from '@/domains/tic-tac-toe/types/match.types';

type Props = {
  match: Match | null;
  now: number;
  isPending: boolean;
  playAiTurn: (input: { expectedVersion: number }) => Promise<unknown>;
};

export const useAiTurn = ({ match, now, isPending, playAiTurn }: Props) => {
  const scheduled = useRef({
    key: '',
    at: 0,
    pending: false,
    completed: false,
  });
  useEffect(() => {
    if (
      !match ||
      match.mode !== 'AI' ||
      match.status !== 'ACTIVE' ||
      match.currentPlayer !== 'PLAYER2' ||
      !match.turnEndsAt
    )
      return;
    const deadline = Date.parse(match.turnEndsAt);
    if (!Number.isFinite(deadline)) return;
    const key = `${match.id}:${match.turnNumber}`;
    if (scheduled.current.key !== key) {
      scheduled.current = {
        key,
        at: deadline - (5 + Math.random() * 10) * 1000,
        pending: false,
        completed: false,
      };
    }
    const turn = scheduled.current;
    if (
      now < turn.at ||
      now >= deadline ||
      isPending ||
      turn.pending ||
      turn.completed
    )
      return;
    turn.pending = true;
    void playAiTurn({ expectedVersion: match.version })
      .then(() => {
        turn.completed = true;
      })
      .catch(() => {
        turn.at = Date.now() + 2000;
      })
      .finally(() => {
        turn.pending = false;
      });
  }, [match, now, isPending, playAiTurn]);
};
