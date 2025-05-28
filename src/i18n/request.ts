import { notFound } from 'next/navigation';
import type { GetRequestConfigParams, RequestConfig } from 'next-intl/server';

import en from '../../messages/en.json';

export const locales = ['en', 'bos'] as const;

export type Locale = (typeof locales)[number];

type Messages = typeof en;

interface ImportedModule {
  default: Messages;
}

const createRequestConfig = async ({
  requestLocale,
}: GetRequestConfigParams): Promise<RequestConfig> => {
  const locale = (await requestLocale) || '';
  if (!locales.includes(locale as Locale)) notFound();

  const messagesModule = (await import(
    `../../messages/${locale}.json`
  )) as ImportedModule;

  return {
    locale,
    messages: messagesModule.default,
  };
};

export default createRequestConfig;
