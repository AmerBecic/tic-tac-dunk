import NextImage, { type ImageProps as NextImageProps } from 'next/image';

import styles from './Image.module.scss';
import { cn } from '@/core/utils/Utils';
import React from 'react';

interface BaseImageProps {
  className?: NextImageProps['className'];
  style?: NextImageProps['style'];
}

export type ImageProps = BaseImageProps &
  Pick<
    NextImageProps,
    | 'src'
    | 'alt'
    | 'width'
    | 'height'
    | 'fill'
    | 'preload'
    | 'loading'
    | 'sizes'
  >;

export const Image = ({
  className,
  style,
  src,
  alt,
  width,
  height,
  fill,
  preload,
  loading,
  sizes,
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
      loading={loading}
      sizes={sizes}
    />
  );
};
