'use client';

import { useGetActiveAiMatch } from '@/domains/tic-tac-toe/hooks/useGetActiveAiMatch';
import { useValidateAnswer } from '@/domains/grid/hooks/useValidateAnswer';
import { useTranslations } from 'next-intl';
import { Grid, GridCell } from '@/features/shared/grid';
import { FlipTile } from '@/features/shared/flip-tile';
import { Logo } from '@/features/shared/logo';
import { Paragraph } from '@/features/shared/ui/paragraph';
import styles from './TicTacToe.module.scss';

export const TicTacToe = () => {
  const t = useTranslations('playersSearch');
  const { activeAiMatch: match } = useGetActiveAiMatch();
  const { validateAnswer, isPending } = useValidateAnswer();

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
      renderCell={(row, column) => (
        <GridCell
          disabled={isPending}
          emptyLabel={t('search')}
          onSelectPlayer={async (player) => {
            await validateAnswer({
              source: 'MATCH',
              matchId: match.id,
              row,
              column,
              playerId: player.id,
            });
          }}
        />
      )}
    />
  );
};
