import BasketballSvg from '@/assets/Basketball.svg';
import { cn } from '@/core/utils/Utils';
import styles from './BasketballLoader.module.scss';

interface BasketballLoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BasketballLoader = ({
  label,
  size = 'md',
  className,
}: BasketballLoaderProps): React.JSX.Element => (
  <div className={cn(styles.loader, styles[size], className)} role="status">
    <BasketballSvg
      className={styles.ball}
      aria-hidden="true"
      focusable="false"
    />
    <span className={styles.label}>{label}</span>
  </div>
);
