'use client';

import { useSyncExternalStore } from 'react';
import CheckmarkSvg from '@/assets/Checkmark.svg';
import { DAILY_PUZZLE_URL } from '@/core/constants/Routes';
import { formatDate } from '@/core/utils/Date';
import { GRID_SIZE } from '@/domains/grid/types/grid.constants';
import { readProgress } from '@/features/daily-puzzle/helpers/DailyPuzzleProgress';
import { Link } from '@/features/shared/ui/link';
import styles from './DailyPuzzleList.module.scss';

const subscribe = (onChange: () => void) => {
  window.addEventListener('storage', onChange);
  window.addEventListener('focus', onChange);
  window.addEventListener('pageshow', onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener('focus', onChange);
    window.removeEventListener('pageshow', onChange);
  };
};

export const DailyPuzzleDateTile = ({
  date,
  locale,
  completedLabel,
}: {
  date: string;
  locale: string;
  completedLabel: string;
}) => {
  const isComplete = useSyncExternalStore(
    subscribe,
    () => {
      const { submissions } = readProgress(`daily:${date}`);
      return (
        new Set(
          submissions
            .filter((answer) => answer.correct)
            .map((answer) => `${answer.row}:${answer.column}`)
        ).size ===
        GRID_SIZE * GRID_SIZE
      );
    },
    () => null
  );
  const dateLabel = <time dateTime={date}>{formatDate(date, locale)}</time>;

  if (isComplete) {
    return (
      <Link
        href={DAILY_PUZZLE_URL(date)}
        className={styles.cell}
        data-completed="true"
      >
        <CheckmarkSvg
          className={styles.completionCheck}
          fill="currentColor"
          stroke="currentColor"
          aria-hidden="true"
          focusable="false"
        />
        <span className={styles.completedLabel}>{completedLabel}</span>
        {dateLabel}
      </Link>
    );
  }

  return (
    <Link href={DAILY_PUZZLE_URL(date)} className={styles.cell}>
      {dateLabel}
    </Link>
  );
};
