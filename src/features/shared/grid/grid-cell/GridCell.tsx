'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { Player } from '@/domains/player/types/player.types';
import { Button } from '@/features/shared/ui/button';
import { BasketballJersey } from '@/features/shared/basketball-jersey/BasketballJersey';
import { PlayerSearchDialog } from '../player-search-dialog/PlayerSearchDialog';
import styles from './GridCell.module.scss';

interface GridCellProps {
  answer?: {
    playerName: string;
    jerseyColor?: string;
    trimColor?: string;
  };
  mark?: 'X' | 'O';
  disabled?: boolean;
  emptyLabel: string;
  celebration?: 'impact' | 'ripple';
  rippleDelayMs?: number;
  onSelectPlayer: (player: Player) => void | Promise<void>;
  children?: ReactNode;
}

export const GridCell = ({
  answer,
  mark,
  disabled,
  emptyLabel,
  celebration,
  rippleDelayMs = 0,
  onSelectPlayer,
  children,
}: GridCellProps) => (
  <PlayerSearchDialog
    onSelectPlayer={onSelectPlayer}
    trigger={
      <Button
        type="button"
        disabled={disabled}
        className={styles.cell}
        data-celebration={celebration}
        style={{ '--ripple-delay': `${rippleDelayMs}ms` } as CSSProperties}
        textProps={{ style: { display: 'contents' } }}
        aria-label={
          answer
            ? [answer.playerName, mark].filter(Boolean).join(', ')
            : emptyLabel
        }
      >
        <BasketballJersey
          mark={answer ? mark : undefined}
          jerseyColor={answer?.jerseyColor}
          trimColor={answer?.trimColor}
          nameColor={answer?.trimColor}
          lastName={answer?.playerName.trim().replace(/^\S+\s+/, '')}
          alt=""
          className={styles.jersey}
        />
        {answer && (
          <span className={styles.playerName}>{answer.playerName}</span>
        )}
        {children}
      </Button>
    }
  />
);
