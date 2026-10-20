import type { Metadata } from 'next';
import { HOW_TO_PLAY_URL } from '@/core/constants/Routes';
import { generateMetadataForRoute } from '@/core/utils/MetadataGenerics';
import { HowToPlay } from '@/features/how-to-play';

export const generateMetadata = (): Promise<Metadata> =>
  generateMetadataForRoute('howToPlay', HOW_TO_PLAY_URL);

export default HowToPlay;
