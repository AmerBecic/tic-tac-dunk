import { Paragraph } from '../../../features/shared/ui/paragraph';
import styles from './styles.module.scss';
import { Image } from '../../../features/shared/ui/image';
import React from 'react';

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
