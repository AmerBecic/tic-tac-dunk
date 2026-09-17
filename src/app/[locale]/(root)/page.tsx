import { Metadata } from 'next';

import { HOME_URL } from '@/core/constants/routes';
import { generateMetadataForRoute } from '@/core/utils/MetadataGenerics';
import { Home } from '@/features/home/components';

export const generateMetadata = (): Promise<Metadata> =>
  generateMetadataForRoute('home', HOME_URL);

export default Home;
