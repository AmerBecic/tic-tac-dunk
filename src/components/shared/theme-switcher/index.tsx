'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Switch } from '@/components/shared/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shared/ui/tooltip';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

export const ThemeSwitcher = (): React.JSX.Element => {
  const t = useTranslations('themeSwitcher');
  const [theme, setTheme] = useState<Theme>('light');

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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Switch
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
