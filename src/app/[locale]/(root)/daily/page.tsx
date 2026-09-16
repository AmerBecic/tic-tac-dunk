import { Metadata } from 'next';

import { generateMetadataForRoute } from '@/core/utils/metadata-generics';
import { DAILY_PUZZLE_URL } from '@/core/constants/routes';
import { DailyPuzzle } from '@/features/daily/DailyPuzzle';

export const generateMetadata = (): Promise<Metadata> =>
  generateMetadataForRoute('dailyPuzzle', DAILY_PUZZLE_URL);

export default DailyPuzzle;
