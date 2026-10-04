'use client';

import { useTranslations } from 'next-intl';
import { useGenerateGrid } from '@/domains/grid/hooks/useGenerateGrid';
import { Grid, GridCell } from '@/features/shared/grid';

export const TicTacToe = () => {
  const { grid } = useGenerateGrid();
  const t = useTranslations('playersSearch');

  return (
    <Grid
      rows={grid?.rows}
      columns={grid?.columns}
      corner={<div />}
      renderCell={() => (
        <GridCell disabled emptyLabel={t('search')} onSelectPlayer={() => {}} />
      )}
    />
  );
};
