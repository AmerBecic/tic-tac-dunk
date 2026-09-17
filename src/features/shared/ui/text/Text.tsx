import { cn } from '@/core/utils/Utils';
import styles from './Text.module.scss';
import React from 'react';

export type FontSize = '56' | '40' | '32' | '28' | '24' | '20' | '16' | '12';

export type TextAlign = 'center' | 'left' | 'right';

interface BaseTextProps {
  bold?: boolean;
  fontSize?: FontSize;
  textAlign?: TextAlign;
}

export type TextProps<T extends React.ElementType> = BaseTextProps &
  Omit<React.ComponentProps<T>, keyof BaseTextProps> & {
    as?: T;
  };

export const Text = <T extends React.ElementType = 'span'>({
  as,
  children,
  className,
  bold = false,
  textAlign = 'center',
  fontSize,
  ...rest
}: TextProps<T>): React.JSX.Element => {
  const Component = as || 'span';

  const classNames = cn(
    styles.text,
    bold && styles.bold,
    fontSize && styles[`text${fontSize}`],
    styles[textAlign],
    className
  );

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  );
};
