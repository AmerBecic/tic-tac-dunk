'use client';

import { useCallback, useEffect, useState } from 'react';
import { GRID_SIZE } from '@/domains/grid';

import {
  readProgress,
  isSubmission,
  STORAGE_PREFIX,
  type Progress,
  type DailyPuzzleSubmission,
} from '@/features/daily-puzzle/helpers/DailyPuzzleProgress';

export type { DailyPuzzleSubmission } from '@/features/daily-puzzle/helpers/DailyPuzzleProgress';

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
