import { HOME_URL } from '@/core/constants/Routes';
import { Link } from '@/features/shared/ui/link';
import { Logo } from '../../../logo';
import { DesktopNav, MobileNav, ProfileDialog } from './components';
import styles from './Header.module.scss';
import React from 'react';

export const Header = (): React.JSX.Element => {
  return (
    <header className={styles.headerContainer}>
      <Link href={HOME_URL} className={styles.logoLink}>
        <Logo />
      </Link>

      <div className={styles.desktopOnly}>
        <DesktopNav />
      </div>
      <div className={styles.profileSlot}>
        <React.Suspense fallback={null}>
          <ProfileDialog />
        </React.Suspense>
      </div>
      <div className={styles.mobileOnly}>
        <MobileNav />
      </div>
    </header>
  );
};
