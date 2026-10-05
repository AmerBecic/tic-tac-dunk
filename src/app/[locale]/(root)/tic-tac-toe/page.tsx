import { getLocale } from 'next-intl/server';
import { HOME_URL } from '@/core/constants/Routes';
import { redirect } from '@/core/i18n/navigation';

export default async function TicTacToePage() {
  const locale = await getLocale();
  redirect({ href: `${HOME_URL}?gamemode=open`, locale });
}
