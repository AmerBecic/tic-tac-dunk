'use client';

import { CircularProgress } from '@mui/material';

import { Paragraph } from '../paragraph';
import { TextProps } from '../text';

import styles from './styles.module.scss';
import { cn } from '@/utils/utils';

type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends React.ComponentProps<'button'> {
  disabled?: boolean;
  variant?: ButtonVariant;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  textProps?: TextProps<'p'>;
  isPending?: boolean;
}

export const Button = ({
  disabled = false,
  variant = 'primary',
  children,
  startIcon,
  endIcon,
  className,
  textProps,
  isPending = false,
  ...rest
}: ButtonProps): JSX.Element => {
  const classNames = cn(
    styles.button,
    variant && styles[variant],
    disabled && styles.disabled,
    className
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.currentTarget.blur();

    if (rest.onClick) {
      rest.onClick(event);
    }
  };

  return (
    <button
      {...rest}
      disabled={disabled || isPending}
      className={classNames}
      onClick={handleClick}
    >
      {isPending ? (
        <CircularProgress />
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
