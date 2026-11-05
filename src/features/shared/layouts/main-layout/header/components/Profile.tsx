'use client';

import { useTranslations } from 'next-intl';
import { ThemeSwitcher } from './ThemeSwitcher';
import styles from './Profile.module.scss';

export const Profile = (): React.JSX.Element => {
  const t = useTranslations('profile');

  return (
    <div className={styles.themeRow}>
      <span className={styles.label}>{t('switchTheme')}</span>
      <div className={styles.switcher}>
        <ThemeSwitcher />
      </div>
    </div>
  );
};
