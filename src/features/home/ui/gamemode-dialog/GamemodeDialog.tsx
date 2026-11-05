'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/features/shared/ui/dialog';
import { PlayNowButton } from '../play-now-button/PlayNowButton';
import { GamemodeSelection } from '../gamemode-selection/GamemodeSelection';

import styles from './GamemodeDialog.module.scss';

export const GamemodeDialog = () => {
  const t = useTranslations('common');
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('gamemode') === 'open';

  const handleOpenChange = (open: boolean) => {
    const url = new URL(window.location.href);
    if (open) {
      url.searchParams.set('gamemode', 'open');
    } else {
      url.searchParams.delete('gamemode');
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
        <PlayNowButton />
      </DialogTrigger>
      <DialogContent className={styles.dialog} closeLabel={t('close')}>
        <GamemodeSelection />
      </DialogContent>
    </Dialog>
  );
};
