'use client';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Drawer } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { Button } from '@/components/shared/button';
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

  const [open, setOpen] = useState<boolean>(false);

  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const openDrawer = (): void => {
    setOpen(true);
  };

  const closeDrawer = (): void => {
    triggerButtonRef.current?.focus();
    setOpen(false);
  };

  return (
    <>
      <Button
        startIcon={<MenuOutlinedIcon className={styles.hamburgerIcon} />}
        onClick={openDrawer}
      />
      <Drawer anchor="right" open={open} onClose={closeDrawer}>
        <nav>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            {PAGES.map(
              ({ titleKey, href }): JSX.Element => (
                <NavbarLink key={titleKey} href={href} onClick={closeDrawer}>
                  {t(titleKey)}
                </NavbarLink>
              )
            )}
          </div>
        </nav>
      </Drawer>
    </>
  );
};
