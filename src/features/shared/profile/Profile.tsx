'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Label } from '@/features/shared/ui/label';
import { Input } from '@/features/shared/ui/input';
import { Button } from '@/features/shared/ui/button';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import styles from './Profile.module.scss';

export const Profile = (): React.JSX.Element => {
  const t = useTranslations('profile');
  const themeSwitchId = useId();
  const usernameId = useId();
  const languageId = useId();
  const favouriteTeamId = useId();

  return (
    <div className={styles.profile}>
      <div className={styles.row}>
        <Label htmlFor={themeSwitchId}>{t('switchTheme')}</Label>
        <ThemeSwitcher id={themeSwitchId} />
      </div>
      <div className={styles.row}>
        <Label htmlFor={languageId}>{t('language')}</Label>
        <LanguageSwitcher id={languageId} />
      </div>
      <div className={styles.row}>
        <Label htmlFor={usernameId}>{t('username')}</Label>
        <Input
          id={usernameId}
          name="username"
          type="text"
          autoComplete="username"
          maxLength={20}
        />
      </div>
      <div className={styles.row}>
        <Label htmlFor={favouriteTeamId}>{t('favouriteTeam')}</Label>
        <Button id={favouriteTeamId} type="button" variant="secondary">
          {t('choose')}
        </Button>
      </div>
    </div>
  );
};
