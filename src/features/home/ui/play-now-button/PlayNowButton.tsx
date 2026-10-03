'use client';

import { Button } from '@/features/shared/ui/button';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './PlayNowButton.module.scss';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/features/shared/ui/dialog';
import { GamemodeSelection } from '../gamemode-selection/GamemodeSelection';
import selectionStyles from '../gamemode-selection/GamemodeSelection.module.scss';

export const PlayNowButton = (): React.JSX.Element => {
  const t = useTranslations('common');
  const tSelection = useTranslations('home.gamemodeSelection');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="primary"
          size="lg"
          endIcon={<ChevronRight size={16} aria-hidden="true" />}
          className={styles.button}
          textProps={{ className: styles.label }}
        >
          {t('play_now')}
        </Button>
      </DialogTrigger>
      <DialogContent className={selectionStyles.dialog} closeLabel={t('close')}>
        <DialogHeader>
          <DialogTitle>{tSelection('title')}</DialogTitle>
          <DialogDescription>{tSelection('description')}</DialogDescription>
        </DialogHeader>
        <GamemodeSelection />
      </DialogContent>
    </Dialog>
  );
};
