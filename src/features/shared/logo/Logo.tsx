import styles from './Logo.module.scss';
import React from 'react';
import { Image } from '../ui/image';
import { Paragraph } from '../ui/paragraph';
import { cn } from '@/core/utils/Utils';

interface LogoProps {
  showLabel?: boolean;
}

export const Logo = ({ showLabel = true }: LogoProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        styles.logoAndTitleContainer,
        !showLabel && styles.logoOnly
      )}
    >
      <div className={styles.logoWrapper}>
        <Image
          src="/logo.png"
          width={30}
          height={30}
          alt="logo"
          className={styles.logo}
        />
      </div>
      {showLabel && <Paragraph fontSize="24">Tic Tac Dunk</Paragraph>}
    </div>
  );
};
