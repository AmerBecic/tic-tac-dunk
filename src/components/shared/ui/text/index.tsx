import { cn } from '@/utils/utils';
import styles from './styles.module.scss';

export type FontSize = '56' | '40' | '32' | '28' | '24' | '20' | '16' | '12';

export type TextAlign = 'center' | 'left' | 'right';

export type FontFamily = 'inter' | 'spaceGrotesk';

export type TextColor = 'white' | 'black';

interface BaseTextProps {
  bold?: boolean;
  fontSize?: FontSize;
  textAlign?: TextAlign;
  textColor?: TextColor;
  fontFamily?: FontFamily;
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
  textColor = 'black',
  fontFamily = 'spaceGrotesk',
  fontSize,
  ...rest
}: TextProps<T>): JSX.Element => {
  const Component = as || 'span';

  const classNames = cn(
    styles.text,
    bold && styles.bold,
    styles[textColor],
    fontSize && styles[`text${fontSize}`],
    styles[textAlign],
    styles[fontFamily],
    className
  );

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  );
};
