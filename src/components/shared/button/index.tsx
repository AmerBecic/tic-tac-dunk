'use client';

import { CircularProgress } from '@mui/material';
import { JSX, ReactNode } from 'react';

import { Paragraph } from '../paragraph';
import { TextProps } from '../text';

import styles from './styles.module.scss';

type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends React.ComponentProps<'button'> {
  disabled?: boolean;
  variant?: ButtonVariant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  textProps?: TextProps<'p'>;
  isPending?: boolean;
}

export const Button = ({
  disabled = false,
  variant = 'primary',
  children,
  className,
  textProps,
  isPending = false,
  ...rest
}: ButtonProps): JSX.Element => {
  const classNames = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  //   const textColor = variant === 'primary' ? 'white' : 'primary';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.currentTarget.blur();
    if (rest.onClick) {
      rest.onClick(event);
    }
  };

  return (
    <button
      {...{ disabled, className: classNames, ...rest }}
      onClick={handleClick}
    >
      {isPending ? (
        <CircularProgress />
      ) : (
        <>
          {' '}
          {children && (
            <Paragraph fontFamily="spaceGrotesk" bold {...textProps}>
              {children}
            </Paragraph>
          )}
        </>
      )}
    </button>
  );
};
