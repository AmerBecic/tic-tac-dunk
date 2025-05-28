import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export interface MetadataGenericsProps {
  title: string;
  description: string;
  keywords?: string;
  slug?: string;
  type?: 'website' | 'article';
  imageUrl?: string;
  publishedTime?: string;
}

const SITE_NAME = 'Tic Tac Dunk';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export const MetadataGenerics = ({
  title,
  description,
  keywords,
  slug,
  type = 'website',
  imageUrl,
  publishedTime,
}: MetadataGenericsProps): Metadata => {
  const pageUrl = slug ? `${SITE_URL}${slug}` : SITE_URL;

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
      siteName: SITE_NAME,
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
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl || DEFAULT_IMAGE],
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

export const generateBasicMetadata = async (
  translationKey: string,
  slug?: string
): Promise<Metadata> => {
  const t = await getTranslations(translationKey);

  return MetadataGenerics({
    title: t('metadata_title'),
    description: t('metadata_description'),
    keywords: t('metadata_keywords'),
    slug,
  });
};
