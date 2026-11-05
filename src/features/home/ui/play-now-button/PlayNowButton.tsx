'use client';

import { Button } from '@/features/shared/ui/button';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './PlayNowButton.module.scss';
import { cn } from '@/core/utils/Utils';

export const PlayNowButton = ({
  className,
  ...props
}: React.ComponentPropsWithRef<'button'>): React.JSX.Element => {
  const t = useTranslations('common');

  return (
    <Button
      type="button"
      variant="primary"
      size="lg"
      endIcon={<ChevronRight size={16} aria-hidden="true" />}
      className={cn(styles.button, className)}
      textProps={{ className: styles.label }}
      {...props}
    >
      {t('play_now')}
    </Button>
  );
};
