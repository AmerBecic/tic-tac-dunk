import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import '@/styles/globals.css';
import { inter, spaceGrotesk } from '@/fonts';

export const metadata: Metadata = {
  title: 'Tic Tac Dunk - NBA Trivia Grid Game',
  description:
    'Test your NBA knowledge by matching players to teams in a strategic and addictive grid game.',
  openGraph: {
    title: 'Tic Tac Dunk',
    description:
      'Think you know NBA history? Prove it in the ultimate grid challenge!',
    url: 'https://yourdomain.com',
    siteName: 'Tic Tac Dunk',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tic Tac Dunk - NBA Grid Game',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const RootLayout = async ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}): Promise<JSX.Element> => {
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <title>Tic Tac Dunk</title>
      <body className={spaceGrotesk.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
