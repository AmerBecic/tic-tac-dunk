'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { useUserStore } from '@/providers/UserStoreProvider';
import { Label } from '@/features/shared/ui/label';
import { Input } from '@/features/shared/ui/input';
import { FavouriteTeamDialog } from './components/FavouriteTeamDialog';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import styles from './Profile.module.scss';

export const Profile = (): React.JSX.Element => {
  const t = useTranslations('profile');
  const themeSwitchId = useId();
  const usernameId = useId();
  const languageId = useId();
  const username = useUserStore((state) => state.username);
  const setUsername = useUserStore((state) => state.setUsername);
  const favouriteTeam = useUserStore((state) => state.favouriteTeam);

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
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div className={styles.row}>
        <span>{t('favouriteTeam')}</span>
        <div className={styles.teamControl}>
          <span>{favouriteTeam ?? t('none')}</span>
          <FavouriteTeamDialog />
        </div>
      </div>
    </div>
  );
};
