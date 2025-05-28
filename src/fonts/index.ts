import { Space_Grotesk, Inter } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--ff-space-grotesk',
  weight: ['400', '700'],
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--ff-inter',
  weight: ['400', '700'],
  display: 'swap',
});
