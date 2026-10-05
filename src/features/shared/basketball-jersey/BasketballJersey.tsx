import { useId, type CSSProperties } from 'react';
import JerseySvg from '@/assets/BasketballJersey.svg';
import styles from './BasketballJersey.module.scss';
import { cn } from '@/core/utils/Utils';

interface BasketballJerseyProps {
  jerseyColor?: string;
  trimColor?: string;
  lastName?: string;
  mark?: 'X' | 'O';
  nameColor?: string;
  size?: number;
  className?: string;
  alt?: string;
}

export const BasketballJersey = ({
  jerseyColor = 'var(--color-gray-400)',
  trimColor = 'var(--color-gray-600)',
  lastName,
  mark,
  nameColor = 'var(--color-black-200)',
  size = 120,
  className,
  alt,
}: BasketballJerseyProps): React.JSX.Element => {
  const namePathId = useId();
  const name = lastName?.trim() ?? '';
  const displayName = name.toUpperCase();
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
      {(hasName || mark) && (
        <svg
          className={styles.name}
          viewBox="0 0 100 100"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <path id={namePathId} d="M 29,49 Q 50,34 71,49" />
          </defs>
          {hasName && (
            <text
              fill={nameColor}
              fontSize={Math.min(9, 60 / Array.from(displayName).length)}
              textAnchor="middle"
            >
              <textPath href={`#${namePathId}`} startOffset="50%">
                {displayName}
              </textPath>
            </text>
          )}
          {mark && (
            <text
              x="50"
              y="72"
              textAnchor="middle"
              fill={nameColor}
              fontSize="28"
            >
              {mark}
            </text>
          )}
        </svg>
      )}
    </span>
  );
};
