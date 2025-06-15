import Image from 'next/image';

import { Paragraph } from '../paragraph';

import { NavBar } from './nav-bar';
import styles from './styles.module.scss';

export const Header = (): JSX.Element => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoAndTitleContainer}>
        <div className={styles.logoWrapper}>
          <Image src="/logo.png" width={40} height={40} alt="logo" />
        </div>
        <Paragraph>Tic Tac Dunk</Paragraph>
      </div>
      <NavBar />
    </header>
  );
};
