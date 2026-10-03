'use client';

import { Fragment, useEffect, useState, type CSSProperties } from 'react';

import styles from './DailyPuzzle.module.scss';
import CheckmarkSvg from '@/assets/Checkmark.svg';
import { useTranslations } from 'next-intl';
import {
  GRID_SIZE,
  useGetDailyPuzzle,
  useValidateAnswer,
} from '@/domains/grid';
import { Criterion } from './criterion/Criterion';
import { Button } from '@/features/shared/ui/button';
import { PlayerSearchDialog } from './player-search-dialog/PlayerSearchDialog';
import { FlipTile } from '@/features/shared/flip-tile';
import { Logo } from '@/features/shared/logo';
import { Paragraph } from '@/features/shared/ui/paragraph';
import { BasketballJersey } from '@/features/shared/basketball-jersey/BasketballJersey';

import { useDailyPuzzleProgress } from '../hooks/useDailyPuzzleProgress';

export const DailyPuzzle = (): React.JSX.Element => {
  const t = useTranslations('dailyPuzzle');
  const playerSearch = useTranslations('playersSearch');
  const { dailyPuzzle } = useGetDailyPuzzle();
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
    <section className={styles.dailyPuzzle}>
      <div className={styles.grid}>
        <FlipTile
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

        {Array.from({ length: GRID_SIZE }, (_, columnIndex) => (
          <Criterion
            category={dailyPuzzle?.columns[columnIndex]}
            key={`column-${columnIndex}`}
          />
        ))}

        {Array.from({ length: GRID_SIZE }, (_, rowIndex) => (
          <Fragment key={`row-${rowIndex}`}>
            <Criterion category={dailyPuzzle?.rows[rowIndex]} />

            {Array.from({ length: GRID_SIZE }, (_, columnIndex) => {
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
                <PlayerSearchDialog
                  key={`cell-${dailyPuzzle?.id}-${rowIndex}-${columnIndex}`}
                  onSelectPlayer={async (player) => {
                    if (!dailyPuzzle || !progress.isReady) return;
                    const result = await validateAnswer({
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
                  trigger={
                    <Button
                      type="button"
                      disabled={
                        !progress.isReady ||
                        progress.submissions.some(
                          (answer) =>
                            answer.row === rowIndex &&
                            answer.column === columnIndex &&
                            answer.correct
                        )
                      }
                      className={styles.cell}
                      data-celebration={
                        isCelebrating
                          ? isImpactCell
                            ? 'impact'
                            : 'ripple'
                          : undefined
                      }
                      style={
                        {
                          '--ripple-delay': `${rippleDelay}ms`,
                        } as CSSProperties
                      }
                      textProps={{ style: { display: 'contents' } }}
                      aria-label={
                        progress.submissions.find(
                          (answer) =>
                            answer.row === rowIndex &&
                            answer.column === columnIndex &&
                            answer.correct
                        )?.playerName ?? playerSearch('search')
                      }
                    >
                      <BasketballJersey
                        jerseyColor={answer?.jerseyColor}
                        trimColor={answer?.trimColor}
                        nameColor={answer?.trimColor}
                        lastName={progress.submissions
                          .find(
                            (answer) =>
                              answer.row === rowIndex &&
                              answer.column === columnIndex &&
                              answer.correct
                          )
                          ?.playerName.trim()
                          .replace(/^\S+\s+/, '')}
                        alt=""
                        className={styles.jersey}
                      />
                      {answer && (
                        <span className={styles.playerName}>
                          {answer.playerName}
                        </span>
                      )}
                    </Button>
                  }
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </section>
  );
};
