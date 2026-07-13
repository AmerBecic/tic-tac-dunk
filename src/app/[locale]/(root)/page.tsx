import { Metadata } from 'next';

import { HOME_URL } from '@/core/constants/routes';
import { generateMetadataForRoute } from '@/core/utils/metadata-generics';

export const generateMetadata = (): Promise<Metadata> =>
  generateMetadataForRoute('home', HOME_URL);

export { default } from '@/features/home';
