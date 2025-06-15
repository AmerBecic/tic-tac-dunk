'use client';

import { Squash as Hamburger } from 'hamburger-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import { DEV_BLOG_URL, HOME_URL, HOW_TO_PLAY_URL } from '@/constants/routes';

import { NavbarLink } from './nav-bar-link';
import styles from './styles.module.scss';

const PAGES = [
  { titleKey: 'home', href: HOME_URL },
  { titleKey: 'how_to_play', href: HOW_TO_PLAY_URL },
  { titleKey: 'dev_blog', href: DEV_BLOG_URL },
];

export const NavBar = (): JSX.Element => {
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
          {PAGES.map(
            ({ titleKey, href }): JSX.Element => (
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
