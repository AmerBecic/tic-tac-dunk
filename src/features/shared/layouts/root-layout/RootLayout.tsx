import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import '@/core/styles/globals.scss';

import { APP_URL } from '@/core/constants/Env';
import { teko } from '@/core/fonts';
import { routing } from '@/core/i18n/routing';

export const metadata: Metadata = {
  description:
    'Test your NBA knowledge by matching players to teams in a strategic and addictive grid game.',
  openGraph: {
    title: 'Tic Tac Dunk',
    description:
      'Think you know NBA history? Prove it in the ultimate grid challenge!',
    url: APP_URL,
    siteName: 'Tic Tac Dunk',
    images: [
      {
        url: `${APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Tic Tac Dunk - NBA Grid Game',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    image: `${APP_URL}/og-image.jpg`,
  },
};

const RootLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<React.ReactNode> => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={teko.variable}>
      <body className={teko.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
