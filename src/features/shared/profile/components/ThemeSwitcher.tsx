'use client';

import { useTranslations } from 'next-intl';
import { useUserStore } from '@/providers/UserStoreProvider';

import { Switch } from '@/features/shared/ui/switch/Switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/features/shared/ui/tooltip';

interface ThemeSwitcherProps {
  id?: string;
}

export const ThemeSwitcher = ({
  id,
}: ThemeSwitcherProps): React.JSX.Element => {
  const t = useTranslations('profile');
  const theme = useUserStore((state) => state.theme);
  const setTheme = useUserStore((state) => state.setTheme);

  const switchTheme = (isDark: boolean): void => {
    setTheme(isDark ? 'dark' : 'light');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Switch
            id={id}
            checked={theme === 'dark'}
            onCheckedChange={switchTheme}
            aria-label={t('switchTheme')}
          />
        </TooltipTrigger>
        <TooltipContent>{t('switchTheme')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
