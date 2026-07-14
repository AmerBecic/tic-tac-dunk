import { Logo } from '../../../logo';
import { ThemeSwitcher } from '../../../theme-switcher';
import { DesktopNav, MobileNav } from './components';
import styles from './Header.module.scss';
import React from 'react';

export const Header = (): React.JSX.Element => {
  return (
    <header className={styles.headerContainer}>
      <Logo />

      <div className={styles.desktopOnly}>
        <DesktopNav />
      </div>
      <ThemeSwitcher />
      <div className={styles.mobileOnly}>
        <MobileNav />
      </div>
    </header>
  );
};
