'use client';

import { useGetActiveAiGame } from '@/domains/tic-tac-toe/hooks/useGetActiveAiGame';
import { useTranslations } from 'next-intl';
import { Grid, GridCell } from '@/features/shared/grid';
import { FlipTile } from '@/features/shared/flip-tile';
import { Logo } from '@/features/shared/logo';
import { Paragraph } from '@/features/shared/ui/paragraph';
import styles from './TicTacToe.module.scss';

export const TicTacToe = () => {
  const t = useTranslations('playersSearch');
  const { activeAiGame: match } = useGetActiveAiGame();

  if (!match) return null;

  return (
    <Grid
      rows={match.grid.rows}
      columns={match.grid.columns}
      corner={
        <FlipTile
          className={styles.titleTile}
          isFlipped={false}
          front={
            <>
              <Logo showLabel={false} />
              <Paragraph className={styles.title}>PvE</Paragraph>
            </>
          }
          back={null}
        />
      }
      renderCell={() => (
        <GridCell disabled emptyLabel={t('search')} onSelectPlayer={() => {}} />
      )}
    />
  );
};
