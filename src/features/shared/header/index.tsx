import { MobileNav } from './mobile-nav';
import styles from './styles.module.scss';
import React from 'react';
import { DesktopNav } from './desktop-nav';
import { ThemeSwitcher } from '../theme-switcher';
import { Logo } from '../logo';

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
