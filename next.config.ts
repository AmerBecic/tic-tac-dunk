import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/core/i18n/request.ts');

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    const imageRule = config.module.rules.find((rule: { test?: RegExp }) =>
      rule.test?.test?.('.svg')
    );
    if (imageRule) imageRule.exclude = /\.svg$/i;
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      {
        message: /No serializer registered for Warning/,
      },
    ];

    return config;
  },
};

export default withNextIntl(nextConfig);
