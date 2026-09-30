'use client';

import { useState, type ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import type { Player } from '@/domains/player/types/player.types';
import { PlayersSearch } from '@/features/shared/players-search';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/ui/dialog';
import styles from './PlayerSearchDialog.module.scss';

interface PlayerSearchDialogProps {
  trigger: ReactElement;
  onSelectPlayer?: (player: Player) => void;
}

export const PlayerSearchDialog = ({
  trigger,
  onSelectPlayer,
}: PlayerSearchDialogProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('playersSearch');
  const common = useTranslations('common');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={styles.content} closeLabel={common('close')}>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        {open && (
          <PlayersSearch
            onSelectPlayer={(player) => {
              onSelectPlayer?.(player);
              setOpen(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
