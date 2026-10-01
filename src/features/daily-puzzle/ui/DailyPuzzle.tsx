'use client';

import { Fragment, useState } from 'react';

import styles from './DailyPuzzle.module.scss';
import { useTranslations } from 'next-intl';
import { GRID_SIZE, GridApi, useGetDailyPuzzle } from '@/domains/grid';
import { Criterion } from './criterion/Criterion';
import { Button } from '@/features/shared/ui/button';
import { PlayerSearchDialog } from './player-search-dialog/PlayerSearchDialog';
import { Logo } from '@/features/shared/logo';
import { Paragraph } from '@/features/shared/ui/paragraph';
import { BasketballJersey } from '@/features/shared/basketball-jersey/BasketballJersey';

import { useDailyPuzzleProgress } from '../hooks/useDailyPuzzleProgress';

export const DailyPuzzle = (): React.JSX.Element => {
  const t = useTranslations('dailyPuzzle');
  const playerSearch = useTranslations('playersSearch');
  const { dailyPuzzle } = useGetDailyPuzzle();
  const progress = useDailyPuzzleProgress(dailyPuzzle?.id);
  const [lastResult, setLastResult] = useState<{
    puzzleId: string;
    correct: boolean;
  } | null>(null);

  return (
    <section className={styles.dailyPuzzle}>
      <Paragraph role="status">
        {t('score', {
          count: progress.correctAnswers,
          total: GRID_SIZE * GRID_SIZE,
        })}
        {lastResult?.puzzleId === dailyPuzzle?.id && lastResult && (
          <> — {t(lastResult.correct ? 'correctAnswer' : 'incorrectAnswer')}</>
        )}
      </Paragraph>
      <div className={styles.grid}>
        <div className={styles.corner}>
          <Logo showLabel={false} />
          <Paragraph className={styles.title}>{t('title')}</Paragraph>
        </div>

        {Array.from({ length: GRID_SIZE }, (_, columnIndex) => (
          <Criterion
            category={dailyPuzzle?.columns[columnIndex]}
            key={`column-${columnIndex}`}
          />
        ))}

        {Array.from({ length: GRID_SIZE }, (_, rowIndex) => (
          <Fragment key={`row-${rowIndex}`}>
            <Criterion category={dailyPuzzle?.rows[rowIndex]} />

            {Array.from({ length: GRID_SIZE }, (_, columnIndex) => (
              <PlayerSearchDialog
                key={`cell-${dailyPuzzle?.id}-${rowIndex}-${columnIndex}`}
                onSelectPlayer={async (player) => {
                  if (!dailyPuzzle || !progress.isReady) return;
                  const result = await GridApi.validateAnswer({
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
                  });
                  setLastResult({
                    puzzleId: dailyPuzzle.id,
                    correct: result.correct,
                  });
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
                      lastName={
                        progress.submissions.find(
                          (answer) =>
                            answer.row === rowIndex &&
                            answer.column === columnIndex &&
                            answer.correct
                        )?.playerName
                      }
                      alt=""
                      size={80}
                      className={styles.jersey}
                    />
                  </Button>
                }
              />
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  );
};
