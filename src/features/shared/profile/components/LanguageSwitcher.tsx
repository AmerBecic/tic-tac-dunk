'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { CircleFlag } from 'react-circle-flags';

import { usePathname, useRouter } from '@/core/i18n/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/shared/ui/select';
import styles from './LanguageSwitcher.module.scss';

const LANGUAGES = [
  { locale: 'en', name: 'English', countryCode: 'gb' },
  { locale: 'bos', name: 'Bosanski', countryCode: 'ba' },
] as const;

interface LanguageSwitcherProps {
  id?: string;
}

export const LanguageSwitcher = ({
  id,
}: LanguageSwitcherProps): React.JSX.Element => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = (value: string): void => {
    const language = LANGUAGES.find((option) => option.locale === value);
    if (!language || language.locale === locale) return;

    const { search, hash } = window.location;
    startTransition(() => {
      router.replace(`${pathname}${search}${hash}`, {
        locale: language.locale,
        scroll: false,
      });
    });
  };

  return (
    <Select value={locale} onValueChange={switchLanguage} disabled={isPending}>
      <SelectTrigger id={id} className={styles.trigger}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((language) => (
          <SelectItem
            key={language.locale}
            value={language.locale}
            textValue={language.name}
          >
            <span className={styles.option}>
              <CircleFlag
                countryCode={language.countryCode}
                width={20}
                height={20}
                alt=""
                aria-hidden="true"
              />
              {language.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
