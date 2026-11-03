import type { Metadata } from 'next';

import { DAILY_PUZZLE_LIST_URL } from '@/core/constants/Routes';
import { generateMetadataForRoute } from '@/core/utils/MetadataGenerics';
import { DailyPuzzleList } from '@/features/daily-puzzle';

export const dynamic = 'force-dynamic';

export const generateMetadata = (): Promise<Metadata> =>
  generateMetadataForRoute('dailyPuzzleList', DAILY_PUZZLE_LIST_URL);

export default DailyPuzzleList;
