'use client';

import * as React from 'react';

import { cn } from '@/core/utils/Utils';
import styles from './Input.module.scss';

export type InputProps = React.ComponentPropsWithoutRef<'input'>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        type={type}
        className={cn(styles.input, className)}
      />
    );
  }
);

Input.displayName = 'Input';
