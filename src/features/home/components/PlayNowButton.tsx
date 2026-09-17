'use client';

import { Button } from '@/features/shared/ui/button';
import { Link } from '@/features/shared/ui/link';
import { DAILY_PUZZLE_URL } from '@/core/constants/Routes';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './PlayNowButton.module.scss';

export const PlayNowButton = (): React.JSX.Element => {
  const t = useTranslations('common');

  return (
    <Button
      component={Link}
      href={DAILY_PUZZLE_URL}
      variant="primary"
      size="lg"
      endIcon={<ChevronRight size={16} aria-hidden="true" />}
      className={styles.button}
      textProps={{ className: styles.label }}
    >
      {t('play_now')}
    </Button>
  );
};
