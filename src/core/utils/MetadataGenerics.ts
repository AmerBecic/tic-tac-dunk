import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { APP_URL } from '@/core/constants/env';

export interface MetadataGenericsProps {
  title: string;
  description: string;
  keywords?: string;
  route?: string;
  type?: 'website' | 'article';
  imageUrl?: string;
  publishedTime?: string;
}

const DEFAULT_IMAGE = `${APP_URL}/og-image.jpg`;

export const MetadataGenerics = ({
  title,
  description,
  keywords,
  route,
  type = 'website',
  imageUrl,
  publishedTime,
}: MetadataGenericsProps): Metadata => {
  const pageUrl = route ? `${APP_URL}${route}` : APP_URL;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type,
      siteName: 'Tic Tac Dunk',
      locale: 'en_US',
      images: [
        {
          url: imageUrl || DEFAULT_IMAGE,
          alt: title,
          width: 1200,
          height: 630,
        },
      ],
      publishedTime,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      image: imageUrl || DEFAULT_IMAGE,
    },
  };
};

export const generateMetadataForRoute = async (
  translationKey: string,
  route?: string
): Promise<Metadata> => {
  const t = await getTranslations(translationKey);

  return MetadataGenerics({
    title: t('metadata_title'),
    description: t('metadata_description'),
    keywords: t('metadata_keywords'),
    route,
  });
};
