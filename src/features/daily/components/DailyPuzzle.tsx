'use client';

import { Fragment } from 'react';

import styles from './DailyPuzzle.module.scss';
import { Logo } from '../../shared/logo';
import { Paragraph } from '../../shared/ui/paragraph';
import { useTranslations } from 'next-intl';
import { GRID_SIZE, useGetDailyPuzzle } from '@/domains/grid';
import { BasketballJersey } from '../../shared/basketball-jersey/BasketballJersey';
import { Criterion } from './Criterion';

export const DailyPuzzle = (): React.JSX.Element => {
  const t = useTranslations('dailyPuzzle');
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
              <div
                className={styles.cell}
                key={`cell-${rowIndex}-${columnIndex}`}
              >
                <BasketballJersey
                  alt="Empty basketball jersey"
                  size={80}
                  className={styles.jersey}
                />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  );
};
