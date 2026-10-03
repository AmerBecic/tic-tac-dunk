'use client';

import { useSearchParams } from 'next/navigation';
import { Dialog } from '@/features/shared/ui/dialog';
import { PlayNowButton } from '../play-now-button/PlayNowButton';
import { GamemodeSelection } from '../gamemode-selection/GamemodeSelection';

export const GamemodeDialog = () => {
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('gamemode') === 'open';

  const handleOpenChange = (open: boolean) => {
    const url = new URL(window.location.href);
    if (open) {
      url.searchParams.set('gamemode', 'open');
    } else {
      url.searchParams.delete('gamemode');
    }
    window.history.replaceState(
      null,
      '',
      `${url.pathname}${url.search}${url.hash}`
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <PlayNowButton />
      <GamemodeSelection />
    </Dialog>
  );
};
