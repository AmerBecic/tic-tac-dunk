import type { ComponentProps, JSX } from 'react';

import { Link as NavigationLink } from '@/core/i18n/navigation';
import { cn } from '@/core/utils/Utils';
import styles from './Link.module.scss';

export type LinkProps = ComponentProps<typeof NavigationLink>;

export const Link = ({
  children,
  className,
  ...rest
}: LinkProps): JSX.Element => {
  const classNames = cn(styles.link, className);

  return (
    <NavigationLink className={classNames} {...rest}>
      {children}
    </NavigationLink>
  );
};
