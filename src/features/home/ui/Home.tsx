'use client';

import React from 'react';
import { Image } from '@/features/shared/ui/image';
import styles from './Home.module.scss';
import { Text } from '@/features/shared/ui/text';
import { PlayNowButton } from './play-now-button/PlayNowButton';

export const Home = (): React.JSX.Element => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          <Text as="span">TIC TAC </Text>
          <Text as="span" className={styles.highlight}>
            DUNK
          </Text>
        </h1>

        <PlayNowButton />
      </div>

      <div className={styles.imageContainer}>
        <Image
          className={styles.gameplayImage}
          src="/gameplay-home.png"
          alt="Tic Tac Dunk gameplay grid"
          width={400}
          height={400}
          loading="eager"
          sizes="(min-width: 768px) 400px, (min-width: 480px) 300px, 200px"
        />
      </div>
    </div>
  );
};
