'use client';

import { useRef, useState, type ReactElement } from 'react';
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
  onSelectPlayer?: (player: Player) => void | Promise<void>;
}

export const PlayerSearchDialog = ({
  trigger,
  onSelectPlayer,
}: PlayerSearchDialogProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const submitting = useRef(false);
  const t = useTranslations('playersSearch');
  const common = useTranslations('common');

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!submitting.current) {
          setOpen(nextOpen);
          setFailed(false);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={styles.content} closeLabel={common('close')}>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        {open && (
          <div aria-busy={pending}>
            <PlayersSearch
              disabled={pending}
              onSelectPlayer={async (player) => {
                if (submitting.current) return;
                submitting.current = true;
                setPending(true);
                setFailed(false);
                try {
                  await onSelectPlayer?.(player);
                  setOpen(false);
                } catch {
                  setFailed(true);
                } finally {
                  submitting.current = false;
                  setPending(false);
                }
              }}
            />
            {pending && <p role="status">{t('validating')}</p>}
            {failed && <p role="alert">{t('validationError')}</p>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
