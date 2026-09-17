'use client';

import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import type { JSX, ReactNode } from 'react';

import { QueryProvider } from '@/core/providers/QueryProvider';

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export const Providers = ({
  children,
  locale,
  messages,
}: ProvidersProps): JSX.Element => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>{children}</QueryProvider>
    </NextIntlClientProvider>
  );
};
