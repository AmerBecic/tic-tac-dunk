import type { HTMLAttributes } from 'react';

import { cn } from '@/utils/utils';
import styles from './styles.module.scss';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({
  className,
  ...props
}: SkeletonProps): React.JSX.Element {
  return (
    <div
      className={cn(styles.skeleton, className)}
      aria-hidden="true"
      {...props}
    />
  );
}
