import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/core/utils/Utils';

import styles from './SwitchSkeleton.module.scss';
import { Skeleton } from '../skeleton';

export type SwitchSkeletonProps = ComponentPropsWithoutRef<typeof Skeleton>;

export const SwitchSkeleton = ({
  className,
  ...props
}: SwitchSkeletonProps): React.JSX.Element => {
  return (
    <Skeleton className={cn(styles.switchSkeleton, className)} {...props} />
  );
};
