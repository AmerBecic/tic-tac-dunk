'use client';

import { Button } from '@/features/shared/ui/button';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './PlayNowButton.module.scss';
import { DialogTrigger } from '@/features/shared/ui/dialog';

export const PlayNowButton = (): React.JSX.Element => {
  const t = useTranslations('common');

  return (
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
  );
};
