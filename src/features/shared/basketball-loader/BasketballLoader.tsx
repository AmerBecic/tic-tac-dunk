import BasketballSvg from '@/assets/Basketball.svg';
import { cn } from '@/core/utils/Utils';
import styles from './BasketballLoader.module.scss';

interface BasketballLoaderProps {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BasketballLoader = ({
  label,
  size = 'md',
  className,
}: BasketballLoaderProps): React.JSX.Element => (
  <div className={cn(styles.loader, styles[size], className)} role="status">
    <div className={styles.scene} aria-hidden="true">
      <span className={styles.shadow} />
      <div className={styles.bounce}>
        <BasketballSvg className={styles.ball} focusable="false" />
      </div>
    </div>
    <span className={styles.label}>{label}</span>
  </div>
);
