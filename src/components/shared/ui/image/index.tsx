import NextImage, { type ImageProps as NextImageProps } from 'next/image';

import styles from './styles.module.scss';
import { cn } from '@/utils/utils';
import React from 'react';

export type ImageObjectFit =
  | 'contain'
  | 'cover'
  | 'fill'
  | 'none'
  | 'scale-down';

interface BaseImageProps {
  objectFit?: ImageObjectFit;
  objectPosition?: React.CSSProperties['objectPosition'];
}

export type ImageProps = BaseImageProps &
  Omit<NextImageProps, keyof BaseImageProps>;

export const Image = ({
  className,
  objectFit,
  objectPosition,
  style,
  ...rest
}: ImageProps): React.JSX.Element => {
  const classNames = cn(styles.image, className);

  const imageStyles = {
    ...style,
    ...(objectFit && { objectFit }),
    ...(objectPosition && { objectPosition }),
  };

  return <NextImage {...rest} className={classNames} style={imageStyles} />;
};
