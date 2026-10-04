import { Fragment, type ReactNode } from 'react';
import { GRID_SIZE } from '@/domains/grid/types/grid.constants';
import type { GridCategory } from '@/domains/grid/types/grid.types';
import { Criterion } from './criterion/Criterion';
import styles from './Grid.module.scss';

interface GridProps {
  rows?: readonly GridCategory[];
  columns?: readonly GridCategory[];
  corner: ReactNode;
  renderCell: (row: number, column: number) => ReactNode;
}

export const Grid = ({ rows, columns, corner, renderCell }: GridProps) => (
  <section className={styles.container}>
    <div className={styles.grid}>
      {corner}
      {Array.from({ length: GRID_SIZE }, (_, column) => (
        <Criterion key={column} category={columns?.[column]} />
      ))}
      {Array.from({ length: GRID_SIZE }, (_, row) => (
        <Fragment key={row}>
          <Criterion category={rows?.[row]} />
          {Array.from({ length: GRID_SIZE }, (_, column) => (
            <Fragment key={column}>{renderCell(row, column)}</Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  </section>
);
