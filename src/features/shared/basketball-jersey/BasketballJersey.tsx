import type { CSSProperties } from 'react';
import JerseySvg from '@/assets/BasketballJersey.svg';
import styles from './BasketballJersey.module.scss';
import { cn } from '@/core/utils/Utils';

interface BasketballJerseyProps {
  jerseyColor?: string;
  trimColor?: string;
  number?: number | string;
  numberColor?: string;
  size?: number;
  className?: string;
  alt?: string;
}

export const BasketballJersey = ({
  jerseyColor = '#9ca3af',
  trimColor = '#6b7280',
  number,
  numberColor = '#ffffff',
  size = 120,
  className,
  alt,
}: BasketballJerseyProps): React.JSX.Element => {
  const hasNumber = number !== undefined && number !== '';
  const label =
    alt ??
    (hasNumber
      ? `Basketball jersey number ${number}`
      : 'Empty basketball jersey');
  const style = {
    '--jersey-color': jerseyColor,
    '--trim-color': trimColor,
    '--jersey-size': `${size}px`,
  } as CSSProperties;

  return (
    <div
      className={cn(styles.jersey, className)}
      data-empty={!hasNumber || undefined}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <JerseySvg
        className={styles.artwork}
        aria-hidden="true"
        focusable="false"
      />
      {hasNumber && (
        <span
          className={styles.number}
          style={{ color: numberColor }}
          aria-hidden="true"
        >
          {number}
        </span>
      )}
    </div>
  );
};
