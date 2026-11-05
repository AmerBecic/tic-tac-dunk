'use client';

import React from 'react';
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
import { Profile } from './Profile';
import styles from './ProfileDialog.module.scss';
import { useTranslations } from 'next-intl';

export const ProfileDialog = (): React.JSX.Element => {
  const searchParams = useSearchParams();
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
    window.history.replaceState(
      null,
      '',
      `${url.pathname}${url.search}${url.hash}`
    );
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
          startIcon={<IconUserCircle size={30} stroke={2} aria-hidden="true" />}
        />
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
