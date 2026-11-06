'use client';

import React from 'react';
import { useUserStore } from '@/providers/UserStoreProvider';
import { Button } from '@/features/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/ui/dialog';
import { useSearchParams } from 'next/navigation';
import { IconUserCircle } from '@tabler/icons-react';
import { Profile } from '@/features/shared/profile';
import styles from './ProfileDialog.module.scss';
import { useTranslations } from 'next-intl';

export const ProfileDialog = (): React.JSX.Element => {
  const searchParams = useSearchParams();
  const username = useUserStore((state) => state.username);
  const t = useTranslations('common');
  const profileT = useTranslations('profile');
  const isOpen = searchParams.get('profile') === 'open';

  const handleOpenChange = (open: boolean) => {
    const url = new URL(window.location.href);
    if (open) {
      url.searchParams.set('profile', 'open');
    } else {
      url.searchParams.delete('profile');
    }
    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    if (open) {
      window.history.pushState(null, '', nextUrl);
    } else {
      window.history.replaceState(null, '', nextUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={profileT('title')}
          className={styles.trigger}
          textProps={{ className: styles.username }}
          endIcon={<IconUserCircle size={30} stroke={2} aria-hidden="true" />}
        >
          {username.trim() || undefined}
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={t('close')} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{profileT('title')}</DialogTitle>
        </DialogHeader>
        <Profile />
      </DialogContent>
    </Dialog>
  );
};
