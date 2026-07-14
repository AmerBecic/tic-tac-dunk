'use client';

import React from 'react';

import { cn } from '@/core/utils/utils';

import styles from './Button.module.scss';
import { TextProps } from '../text';
import { Paragraph } from '../paragraph';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  textProps?: TextProps<'p'>;
}

export const Button = ({
  disabled = false,
  variant = 'primary',
  size = 'md',
  children,
  startIcon,
  endIcon,
  className,
  textProps,
  onClick,
  ...rest
}: ButtonProps): React.JSX.Element => {
  const variantClassMap = {
    primary: styles.primary,
    secondary: styles.secondary,
    danger: styles.danger,
    ghost: styles.ghost,
  } satisfies Record<ButtonVariant, string>;

  const sizeClassMap = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
    xl: styles.xl,
  } satisfies Record<ButtonSize, string>;

  const classNames = cn(
    styles.button,
    variantClassMap[variant],
    sizeClassMap[size],
    disabled && styles.disabled,
    className
  );

  return (
    <button
      {...rest}
      disabled={disabled}
      className={classNames}
      onClick={onClick}
    >
      {startIcon && <span className={styles.icon}>{startIcon}</span>}

      {children && (
        <Paragraph
          fontFamily="spaceGrotesk"
          bold
          {...textProps}
          className={cn(styles.label, textProps?.className)}
        >
          {children}
        </Paragraph>
      )}

      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
};
