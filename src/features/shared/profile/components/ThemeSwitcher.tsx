'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { SwitchSkeleton } from '@/features/shared/ui/switch/SwitchSkeleton';
import { Switch } from '@/features/shared/ui/switch/Switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/features/shared/ui/tooltip';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

interface ThemeSwitcherProps {
  id?: string;
}

export const ThemeSwitcher = ({
  id,
}: ThemeSwitcherProps): React.JSX.Element => {
  const t = useTranslations('profile');
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme: Theme =
      savedTheme === 'light' || savedTheme === 'dark'
        ? savedTheme
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

    document.documentElement.dataset.theme = initialTheme;
    const animationFrame = window.requestAnimationFrame(() => {
      setTheme(initialTheme);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  const switchTheme = (isDark: boolean): void => {
    const nextTheme: Theme = isDark ? 'dark' : 'light';

    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  if (theme === null) {
    return <SwitchSkeleton />;
  }

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
