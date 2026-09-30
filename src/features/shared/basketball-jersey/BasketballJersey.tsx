import type { CSSProperties } from 'react';
import JerseySvg from '@/assets/BasketballJersey.svg';
import styles from './BasketballJersey.module.scss';
import { cn } from '@/core/utils/Utils';

interface BasketballJerseyProps {
  jerseyColor?: string;
  trimColor?: string;
  lastName?: string;
  nameColor?: string;
  size?: number;
  className?: string;
  alt?: string;
}

export const BasketballJersey = ({
  jerseyColor = '#9ca3af',
  trimColor = '#6b7280',
  lastName,
  nameColor = '#ffffff',
  size = 120,
  className,
  alt,
}: BasketballJerseyProps): React.JSX.Element => {
  const name = lastName?.trim() ?? '';
  const hasName = name.length > 0;
  const label =
    alt ??
    (hasName ? `Basketball jersey for ${name}` : 'Empty basketball jersey');
  const style = {
    '--jersey-color': jerseyColor,
    '--trim-color': trimColor,
    '--jersey-size': `${size}px`,
  } as CSSProperties;

  return (
    <span
      className={cn(styles.jersey, className)}
      data-empty={!hasName || undefined}
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
      {hasName && (
        <span
          className={styles.name}
          style={{
            color: nameColor,
            fontSize: `${Math.min(9, 60 / Array.from(name.toUpperCase()).length)}cqw`,
          }}
          aria-hidden="true"
        >
          {name}
        </span>
      )}
    </span>
  );
};
