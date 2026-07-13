'use client';

import React from 'react';

import { cn } from '@/core/utils/utils';

import { Paragraph } from '../paragraph';
import { TextProps } from '../text';

import styles from './styles.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

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
  } satisfies Record<ButtonSize, string>;

  const classNames = cn(
    styles.button,
    variantClassMap[variant],
    sizeClassMap[size],
    disabled && styles.disabled,
    className
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.currentTarget.blur();
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      disabled={disabled}
      className={classNames}
      onClick={handleClick}
    >
      {startIcon}

      {children && (
        <Paragraph fontFamily="spaceGrotesk" bold {...textProps}>
          {children}
        </Paragraph>
      )}

      {endIcon}
    </button>
  );
};
