import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/utils/utils';

import styles from './styles.module.scss';
import { Skeleton } from '../skeleton';

export type SwitchSkeletonProps = ComponentPropsWithoutRef<typeof Skeleton>;

export function SwitchSkeleton({
  className,
  ...props
}: SwitchSkeletonProps): React.JSX.Element {
  return (
    <Skeleton className={cn(styles.switchSkeleton, className)} {...props} />
  );
}
