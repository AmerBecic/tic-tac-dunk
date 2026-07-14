import styles from './Logo.module.scss';
import React from 'react';
import { Image } from '../ui/image';
import { Paragraph } from '../ui/paragraph';

export const Logo = (): React.JSX.Element => {
  return (
    <div className={styles.logoAndTitleContainer}>
      <div className={styles.logoWrapper}>
        <Image
          src="/logo.png"
          width={30}
          height={30}
          alt="logo"
          className={styles.logo}
        />
      </div>
      <Paragraph>Tic Tac Dunk</Paragraph>
    </div>
  );
};
