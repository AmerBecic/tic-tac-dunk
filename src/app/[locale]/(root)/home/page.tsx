import { Metadata } from 'next';

import { HOME_URL } from '@/constants/routes/home';
import { generateBasicMetadata } from '@/utils/metadata-generics';

export const generateMetadata = (): Promise<Metadata> =>
  generateBasicMetadata('home', HOME_URL);

export { default } from '@/components/pages/home';
