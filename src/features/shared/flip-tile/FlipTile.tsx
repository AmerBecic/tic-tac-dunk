import type { CSSProperties, ReactNode, AriaRole } from 'react';
import { cn } from '@/core/utils/Utils';
import styles from './FlipTile.module.scss';

interface FlipTileProps {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
  isReady?: boolean;
  animate?: boolean;
  delayMs?: number;
  className?: string;
  role?: AriaRole;
}

export const FlipTile = ({
  front,
  back,
  isFlipped,
  isReady = true,
  animate = false,
  delayMs = 0,
  className,
  role,
}: FlipTileProps): React.JSX.Element => (
  <div
    className={cn(styles.tile, className)}
    data-flipped={isFlipped || undefined}
    data-animate={(isReady && isFlipped && animate) || undefined}
    role={role}
    style={{ '--flip-delay': `${delayMs}ms` } as CSSProperties}
  >
    <div
      className={styles.card}
      style={{ visibility: isReady ? 'visible' : 'hidden' }}
    >
      <div className={styles.front} aria-hidden={!isReady || isFlipped}>
        {front}
      </div>
      <div className={styles.back} aria-hidden={!isReady || !isFlipped}>
        {back}
      </div>
    </div>
  </div>
);
