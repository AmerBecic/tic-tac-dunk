import { GRID_SIZE } from '@/domains/grid/types/grid.constants';

export type DailyPuzzleSubmission = {
  row: number;
  column: number;
  playerId: string;
  playerName: string;
  correct: boolean;
  jerseyColor?: string;
  trimColor?: string;
};

export type Progress = {
  puzzleId: string;
  submissions: DailyPuzzleSubmission[];
};

export const STORAGE_PREFIX = 'daily-puzzle-progress:';

export function isSubmission(value: unknown): value is DailyPuzzleSubmission {
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
    typeof submission.correct === 'boolean' &&
    (submission.jerseyColor === undefined ||
      typeof submission.jerseyColor === 'string') &&
    (submission.trimColor === undefined ||
      typeof submission.trimColor === 'string')
  );
}

export function readProgress(puzzleId: string): Progress {
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
