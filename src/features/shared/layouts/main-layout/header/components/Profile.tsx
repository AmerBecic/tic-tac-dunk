'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Label } from '@/features/shared/ui/label';
import { ThemeSwitcher } from './ThemeSwitcher';
import styles from './Profile.module.scss';

export const Profile = (): React.JSX.Element => {
  const t = useTranslations('profile');
  const themeSwitchId = useId();

  return (
    <div className={styles.themeRow}>
      <Label htmlFor={themeSwitchId} className={styles.label}>
        {t('switchTheme')}
      </Label>
      <div className={styles.switcher}>
        <ThemeSwitcher id={themeSwitchId} />
      </div>
    </div>
  );
};
