'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { useUserStore } from '@/providers/UserStoreProvider';
import { Button } from '@/features/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/ui/dialog';
import { TeamSelection } from './TeamSelection';

export const FavouriteTeamDialog = (): React.JSX.Element => {
  const t = useTranslations('profile');
  const commonT = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);
  const favouriteTeam = useUserStore((state) => state.favouriteTeam);
  const setFavouriteTeam = useUserStore((state) => state.setFavouriteTeam);

  const selectTeam = (code: string): void => {
    setFavouriteTeam(code);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="primary">
          {t('change')}
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={commonT('close')} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t('favouriteTeam')}</DialogTitle>
        </DialogHeader>
        <TeamSelection selectedTeam={favouriteTeam} onSelect={selectTeam} />
      </DialogContent>
    </Dialog>
  );
};
