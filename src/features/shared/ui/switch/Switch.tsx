'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/core/utils/Utils';
import styles from './Switch.module.scss';

export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(styles.root, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className={styles.thumb} />
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = SwitchPrimitive.Root.displayName;
