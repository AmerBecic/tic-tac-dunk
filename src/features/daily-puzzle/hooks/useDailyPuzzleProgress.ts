'use client';

import { useCallback, useEffect, useState } from 'react';
import { GRID_SIZE } from '@/domains/grid';

export type DailyPuzzleSubmission = {
  row: number;
  column: number;
  playerId: string;
  playerName: string;
  correct: boolean;
};

type Progress = {
  puzzleId: string;
  submissions: DailyPuzzleSubmission[];
};

const STORAGE_PREFIX = 'daily-puzzle-progress:';

function isSubmission(value: unknown): value is DailyPuzzleSubmission {
  if (!value || typeof value !== 'object') return false;
  const submission = value as Record<string, unknown>;
  return (
    typeof submission.row === 'number' &&
    Number.isInteger(submission.row) &&
    submission.row >= 0 &&
    submission.row < GRID_SIZE &&
    typeof submission.column === 'number' &&
    Number.isInteger(submission.column) &&
    submission.column >= 0 &&
    submission.column < GRID_SIZE &&
    typeof submission.playerId === 'string' &&
    submission.playerId.length > 0 &&
    typeof submission.playerName === 'string' &&
    typeof submission.correct === 'boolean'
  );
}

function readProgress(puzzleId: string): Progress {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${puzzleId}`);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === 'object') {
      const progress = parsed as Record<string, unknown>;
      if (
        progress.puzzleId === puzzleId &&
        Array.isArray(progress.submissions) &&
        progress.submissions.every(isSubmission)
      ) {
        return { puzzleId, submissions: progress.submissions };
      }
    }
  } catch {}
  return { puzzleId, submissions: [] };
}

export function useDailyPuzzleProgress(puzzleId: string | null | undefined) {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(puzzleId ? readProgress(puzzleId) : null);
  }, [puzzleId]);

  useEffect(() => {
    if (!progress || progress.puzzleId !== puzzleId) return;
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}${puzzleId}`,
        JSON.stringify(progress)
      );
    } catch {}
  }, [progress, puzzleId]);

  const recordSubmission = useCallback(
    (submission: DailyPuzzleSubmission) => {
      if (!isSubmission(submission)) return;
      setProgress((current) => {
        if (!current || current.puzzleId !== puzzleId) return current;
        const alreadySolved = current.submissions.some(
          (answer) =>
            answer.row === submission.row &&
            answer.column === submission.column &&
            answer.correct
        );
        if (alreadySolved) return current;
        return {
          ...current,
          submissions: [...current.submissions, { ...submission }],
        };
      });
    },
    [puzzleId]
  );

  const resetProgress = useCallback(() => {
    setProgress((current) =>
      current && current.puzzleId === puzzleId
        ? { ...current, submissions: [] }
        : current
    );
  }, [puzzleId]);

  const isReady = Boolean(puzzleId && progress?.puzzleId === puzzleId);
  const submissions = isReady ? progress!.submissions : [];
  const correctAnswers = new Set(
    submissions
      .filter((submission) => submission.correct)
      .map((submission) => `${submission.row}:${submission.column}`)
  ).size;

  return {
    isReady,
    submissions,
    correctAnswers,
    totalGuesses: submissions.length,
    isComplete: correctAnswers === GRID_SIZE * GRID_SIZE,
    recordSubmission,
    resetProgress,
  };
}
