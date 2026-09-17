'use client';

import React from 'react';

import { cn } from '@/core/utils/Utils';

import styles from './Button.module.scss';
import { TextProps } from '../text';
import { Paragraph } from '../paragraph';
import { Link, type LinkProps } from '../link';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  textProps?: TextProps<'p'>;
}

export type ButtonProps = BaseButtonProps &
  (
    | (React.ComponentPropsWithoutRef<'button'> & { component?: 'button' })
    | (LinkProps & { component: typeof Link; disabled?: never })
  );

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  startIcon,
  endIcon,
  className,
  textProps,
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
    rest.disabled && styles.disabled,
    className
  );

  const content = (
    <>
      {startIcon && <span className={styles.icon}>{startIcon}</span>}

      {children && (
        <Paragraph
          bold
          {...textProps}
          className={cn(styles.label, textProps?.className)}
        >
          {children}
        </Paragraph>
      )}

      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </>
  );

  if (typeof rest.component === 'function') {
    const { component: Component, ...linkProps } = rest;
    return (
      <Component {...linkProps} className={classNames}>
        {content}
      </Component>
    );
  }

  const { component: Component = 'button', ...buttonProps } = rest;
  return (
    <Component {...buttonProps} className={classNames}>
      {content}
    </Component>
  );
};
