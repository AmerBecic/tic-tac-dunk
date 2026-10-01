'use client';

import { Fragment } from 'react';

import styles from './DailyPuzzle.module.scss';
import { useTranslations } from 'next-intl';
import { GRID_SIZE, useGetDailyPuzzle } from '@/domains/grid';
import { Criterion } from './criterion/Criterion';
import { Button } from '@/features/shared/ui/button';
import { PlayerSearchDialog } from './player-search-dialog/PlayerSearchDialog';
import { Logo } from '@/features/shared/logo';
import { Paragraph } from '@/features/shared/ui/paragraph';
import { BasketballJersey } from '@/features/shared/basketball-jersey/BasketballJersey';

export const DailyPuzzle = (): React.JSX.Element => {
  const t = useTranslations('dailyPuzzle');
  const playerSearch = useTranslations('playersSearch');
  const { dailyPuzzle } = useGetDailyPuzzle();

  return (
    <section className={styles.dailyPuzzle}>
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
                key={`cell-${rowIndex}-${columnIndex}`}
                trigger={
                  <Button
                    type="button"
                    className={styles.cell}
                    textProps={{ style: { display: 'contents' } }}
                    aria-label={playerSearch('search')}
                  >
                    <BasketballJersey
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
