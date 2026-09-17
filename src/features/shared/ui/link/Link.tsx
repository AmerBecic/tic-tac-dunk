import NextLink from 'next/link';
import type { ComponentProps, JSX } from 'react';

import { cn } from '@/core/utils/Utils';
import styles from './Link.module.scss';

export type LinkProps = ComponentProps<typeof NextLink>;

export const Link = ({
  children,
  className,
  ...rest
}: LinkProps): JSX.Element => {
  const classNames = cn(styles.link, className);

  return (
    <NextLink className={classNames} {...rest}>
      {children}
    </NextLink>
  );
};
