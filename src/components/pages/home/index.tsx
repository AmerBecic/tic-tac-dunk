import { useTranslations } from 'next-intl';
import React from 'react';

const Home = (): React.JSX.Element => {
  const t = useTranslations('home');

  return <div>{t('test')}</div>;
};

export default Home;
