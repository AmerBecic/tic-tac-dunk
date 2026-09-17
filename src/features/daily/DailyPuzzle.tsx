'use client';

import { Fragment } from 'react';

import styles from './DailyPuzzle.module.scss';
import { Logo } from '../shared/logo';
import { Paragraph } from '../shared/ui/paragraph';
import { useTranslations } from 'next-intl';
import { GRID_SIZE, useGenerateGrid } from '@/domains/grid';

export const DailyPuzzle = (): React.JSX.Element => {
  const t = useTranslations('dailyPuzzle');
  const { grid } = useGenerateGrid();

  console.log('GRID:', grid);
  return (
    <section className={styles.dailyPuzzle}>
      <div className={styles.grid} aria-hidden="true">
        <div className={styles.corner}>
          <Logo showLabel={false} />
          <Paragraph fontSize="24">{t('title')}</Paragraph>
        </div>

        {Array.from({ length: GRID_SIZE }, (_, columnIndex) => (
          <div className={styles.criterion} key={`column-${columnIndex}`} />
        ))}

        {Array.from({ length: GRID_SIZE }, (_, rowIndex) => (
          <Fragment key={`row-${rowIndex}`}>
            <div className={styles.criterion} />

            {Array.from({ length: GRID_SIZE }, (_, columnIndex) => (
              <div
                className={styles.cell}
                key={`cell-${rowIndex}-${columnIndex}`}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  );
};
