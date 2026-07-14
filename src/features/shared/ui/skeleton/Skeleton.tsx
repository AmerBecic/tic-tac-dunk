import type { HTMLAttributes } from 'react';

import { cn } from '@/core/utils/utils';
import styles from './Skeleton.module.scss';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({
  className,
  ...props
}: SkeletonProps): React.JSX.Element => {
  return (
    <div
      className={cn(styles.skeleton, className)}
      aria-hidden="true"
      {...props}
    />
  );
};
