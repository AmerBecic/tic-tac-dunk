import { Metadata } from 'next';

import { HOME_URL } from '@/constants/routes';
import { generateMetadataForRoute } from '@/utils/metadata-generics';

export const generateMetadata = (): Promise<Metadata> =>
  generateMetadataForRoute('home', HOME_URL);

export { default } from '@/components/pages/home';
