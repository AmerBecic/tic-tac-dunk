'use client';

import { Button } from '@/features/shared/ui/button';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './PlayNowButton.module.scss';

export const PlayNowButton = (): React.JSX.Element => {
  const t = useTranslations('common');

  return (
    <Button
      variant="primary"
      size="lg"
      endIcon={<ChevronRight size={16} aria-hidden="true" />}
      onClick={() => {
        window.open('https://app.vega.xyz/', '_blank');
      }}
      className={styles.button}
      textProps={{ className: styles.label }}
    >
      {t('play_now')}
    </Button>
  );
};
