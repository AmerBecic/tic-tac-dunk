import Image from 'next/image';

import { HamburgerMenu } from './components/hamburger-menu';
import styles from './styles.module.scss';

export const Header = (): JSX.Element => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoAndTitleContainer}>
        <div style={{ backgroundColor: 'orange' }}>
          <Image src="/logo.png" width={40} height={40} alt="logo" />
        </div>
        <p>Tic Tac Dunk</p>
      </div>
      <HamburgerMenu />
    </div>
  );
};
