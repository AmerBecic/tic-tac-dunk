import { Metadata } from 'next';

import { generateBasicMetadata } from '@/utils/metadata-generics';

export const generateMetadata = (): Promise<Metadata> =>
  generateBasicMetadata('home', '/home');

export { default } from '@/components/pages/home';
