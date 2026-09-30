import { Metadata } from 'next';

import { generateMetadataForRoute } from '@/core/utils/MetadataGenerics';
import { DAILY_PUZZLE_URL } from '@/core/constants/Routes';
import { DailyPuzzle } from '@/features/daily-puzzle/DailyPuzzle';

export const generateMetadata = (): Promise<Metadata> =>
  generateMetadataForRoute('dailyPuzzle', DAILY_PUZZLE_URL);

export default DailyPuzzle;
