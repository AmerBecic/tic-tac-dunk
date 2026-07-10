'use client';

import React from 'react';
import { CircularProgress } from '@mui/material';

import { cn } from '@/utils/utils';

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
  isPending?: boolean;
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
  isPending = false,
  onClick,
  ...rest
}: ButtonProps): React.JSX.Element => {
  const classNames = cn(
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    isPending && styles.pending,
    className
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.currentTarget.blur();
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      disabled={disabled || isPending}
      className={classNames}
      onClick={handleClick}
    >
      {isPending ? (
        <CircularProgress size={20} />
      ) : (
        <>
          {startIcon}

          {children && (
            <Paragraph fontFamily="spaceGrotesk" bold {...textProps}>
              {children}
            </Paragraph>
          )}

          {endIcon}
        </>
      )}
    </button>
  );
};
