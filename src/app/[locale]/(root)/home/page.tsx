import { useTranslations } from 'next-intl';

const Home = (): JSX.Element => {
  const t = useTranslations('home');

  return <div>{t('test')}</div>;
};

export default Home;
