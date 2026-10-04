'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Grid, GridCell } from '@/features/shared/grid';
import { FlipTile } from '@/features/shared/flip-tile';
import { Logo } from '@/features/shared/logo';
import { Paragraph } from '@/features/shared/ui/paragraph';
import styles from './TicTacToe.module.scss';
import { useCreateTicTacToeMatch } from '@/domains/tic-tac-toe/hooks/useCreateTicTacToeMatch';
import { DEFAULT_TURN_DURATION_SECONDS } from '@/domains/tic-tac-toe/types/tic-tac-toe.constants';

export const TicTacToe = () => {
  const { mutate: createTicTacToeMatch, data: match } =
    useCreateTicTacToeMatch();
  const t = useTranslations('playersSearch');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    createTicTacToeMatch({
      mode: 'AI',
      turnDurationSeconds: DEFAULT_TURN_DURATION_SECONDS,
    });
  }, [createTicTacToeMatch]);

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
