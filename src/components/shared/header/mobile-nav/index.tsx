'use client';

import { Squash as Hamburger } from 'hamburger-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import { NavbarLink } from '../nav-bar-link';

import styles from './styles.module.scss';
import React from 'react';
import { NAVIGATION } from '@/constants/pages';

export const MobileNav = (): React.JSX.Element => {
  const t = useTranslations('header');
  const containerRef = useRef(null);

  const [isOpen, setOpen] = useState<boolean>(false);

  const closeDrawer = (): void => {
    setOpen(false);
  };
  useClickAway(containerRef, (): void => setOpen(false));

  return (
    <div ref={containerRef}>
      <Hamburger toggled={isOpen} size={20} toggle={setOpen} />
      {isOpen && (
        <nav className={styles.nav}>
          {NAVIGATION.map(
            ({ titleKey, href }): React.JSX.Element => (
              <NavbarLink key={titleKey} href={href} onClick={closeDrawer}>
                {t(titleKey)}
              </NavbarLink>
            )
          )}
        </nav>
      )}
    </div>
  );
};
