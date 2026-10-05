'use client';

import { useEffect, useState } from 'react';

import styles from './DailyPuzzle.module.scss';
import CheckmarkSvg from '@/assets/Checkmark.svg';
import { useTranslations } from 'next-intl';
import {
  GRID_SIZE,
  useGetDailyPuzzle,
  useValidateAnswer,
} from '@/domains/grid';
import { Grid, GridCell } from '@/features/shared/grid';
import { FlipTile } from '@/features/shared/flip-tile';
import { Logo } from '@/features/shared/logo';
import { Paragraph } from '@/features/shared/ui/paragraph';

import { useDailyPuzzleProgress } from '../hooks/useDailyPuzzleProgress';

interface DailyPuzzleProps {
  date: string;
}

export const DailyPuzzle = ({ date }: DailyPuzzleProps): React.JSX.Element => {
  const t = useTranslations('dailyPuzzle');
  const playerSearch = useTranslations('playersSearch');
  const { dailyPuzzle } = useGetDailyPuzzle({ date });
  const { validateAnswer } = useValidateAnswer();
  const progress = useDailyPuzzleProgress(dailyPuzzle?.id);
  const [celebration, setCelebration] = useState<{
    puzzleId: string;
    row: number;
    column: number;
  } | null>(null);
  const isCelebrating =
    celebration?.puzzleId === dailyPuzzle?.id && progress.isComplete;

  useEffect(() => {
    if (!celebration) return;
    const timeout = window.setTimeout(() => {
      setCelebration(null);
    }, 3300);
    return () => window.clearTimeout(timeout);
  }, [celebration]);

  return (
    <Grid
      rows={dailyPuzzle?.rows}
      columns={dailyPuzzle?.columns}
      corner={
        <FlipTile
          className={styles.titleTile}
          isFlipped={progress.isComplete}
          isReady={progress.isReady}
          animate={isCelebrating}
          delayMs={2150}
          role="status"
          front={
            <>
              <Logo showLabel={false} />
              <Paragraph className={styles.title}>{t('title')}</Paragraph>
            </>
          }
          back={
            <>
              <CheckmarkSvg
                className={styles.completionCheck}
                fill="currentColor"
                stroke="currentColor"
                aria-hidden="true"
                focusable="false"
              />
              <span className={styles.completedLabel}>{t('completed')}</span>
            </>
          }
        />
      }
      renderCell={(rowIndex, columnIndex) => {
        const answer = progress.submissions.find(
          (submission) =>
            submission.row === rowIndex &&
            submission.column === columnIndex &&
            submission.correct
        );
        const isImpactCell =
          isCelebrating &&
          celebration?.row === rowIndex &&
          celebration?.column === columnIndex;
        const rippleDelay =
          isCelebrating && celebration
            ? 600 +
              Math.hypot(
                rowIndex - celebration.row,
                columnIndex - celebration.column
              ) *
                150
            : 0;
        return (
          <GridCell
            key={`cell-${dailyPuzzle?.id}-${rowIndex}-${columnIndex}`}
            onSelectPlayer={async (player) => {
              if (!dailyPuzzle || !progress.isReady) return;
              const result = await validateAnswer({
                source: 'DAILY',
                puzzleId: dailyPuzzle.id,
                row: rowIndex,
                column: columnIndex,
                playerId: player.id,
              });
              progress.recordSubmission({
                row: rowIndex,
                column: columnIndex,
                playerId: player.id,
                playerName: player.name,
                correct: result.correct,
                jerseyColor: result.jerseyColor,
                trimColor: result.trimColor,
              });
              if (
                result.correct &&
                !answer &&
                progress.correctAnswers === GRID_SIZE * GRID_SIZE - 1
              ) {
                setCelebration({
                  puzzleId: dailyPuzzle.id,
                  row: Math.floor(GRID_SIZE / 2),
                  column: Math.floor(GRID_SIZE / 2),
                });
              }
            }}
            answer={answer}
            disabled={!progress.isReady || Boolean(answer)}
            emptyLabel={playerSearch('search')}
            celebration={
              isCelebrating ? (isImpactCell ? 'impact' : 'ripple') : undefined
            }
            rippleDelayMs={rippleDelay}
          />
        );
      }}
    />
  );
};
