import NextImage, { type ImageProps as NextImageProps } from 'next/image';

import styles from './styles.module.scss';
import { cn } from '@/core/utils/utils';
import React from 'react';

interface BaseImageProps {
  className?: NextImageProps['className'];
  style?: NextImageProps['style'];
}

export type ImageProps = BaseImageProps &
  Pick<NextImageProps, 'src' | 'alt' | 'width' | 'height' | 'fill' | 'preload'>;

export const Image = ({
  className,
  style,
  src,
  alt,
  width,
  height,
  fill,
  preload,
}: ImageProps): React.JSX.Element => {
  const classNames = cn(styles.image, className);

  const imageStyles = {
    ...style,
  };

  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      preload={preload}
      className={classNames}
      style={imageStyles}
    />
  );
};
