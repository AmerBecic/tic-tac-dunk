import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getDailyPuzzleDateError } from '@/domains/grid/helpers/DailyPuzzleDate';

import { generateMetadataForRoute } from '@/core/utils/MetadataGenerics';
import { DAILY_PUZZLE_URL } from '@/core/constants/Routes';
import { DailyPuzzle } from '@/features/daily-puzzle';

export const dynamic = 'force-dynamic';

type DailyPageProps = {
  params: Promise<{ locale: string; date: string }>;
};

export const generateMetadata = async ({
  params,
}: DailyPageProps): Promise<Metadata> => {
  const { date } = await params;
  if (getDailyPuzzleDateError(date)) notFound();

  return generateMetadataForRoute('dailyPuzzle', DAILY_PUZZLE_URL(date));
};

export default async function DailyPage({ params }: DailyPageProps) {
  const { date } = await params;
  if (getDailyPuzzleDateError(date)) notFound();

  return <DailyPuzzle key={date} date={date} />;
}
