import type { ComponentPropsWithRef, JSX } from 'react';

import { cn } from '@/core/utils/Utils';

import styles from './Card.module.scss';

export type CardProps = ComponentPropsWithRef<'div'>;
export type CardTitleProps = ComponentPropsWithRef<'h3'> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};
export type CardDescriptionProps = ComponentPropsWithRef<'p'>;

export const Card = ({ className, ...props }: CardProps): JSX.Element => (
  <div className={cn(styles.card, className)} {...props} />
);

export const CardHeader = ({ className, ...props }: CardProps): JSX.Element => (
  <div className={cn(styles.header, className)} {...props} />
);

export const CardAction = ({ className, ...props }: CardProps): JSX.Element => (
  <div className={cn(styles.action, className)} {...props} />
);

export const CardTitle = ({
  as: Heading = 'h3',
  className,
  ...props
}: CardTitleProps): JSX.Element => (
  <Heading className={cn(styles.title, className)} {...props} />
);

export const CardDescription = ({
  className,
  ...props
}: CardDescriptionProps): JSX.Element => (
  <p className={cn(styles.description, className)} {...props} />
);

export const CardContent = ({
  className,
  ...props
}: CardProps): JSX.Element => (
  <div className={cn(styles.content, className)} {...props} />
);

export const CardFooter = ({ className, ...props }: CardProps): JSX.Element => (
  <div className={cn(styles.footer, className)} {...props} />
);
