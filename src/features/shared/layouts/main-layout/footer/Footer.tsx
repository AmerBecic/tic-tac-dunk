import { getLocale, getTranslations } from 'next-intl/server';
import { DATA_LAST_UPDATED_AT } from '@/core/constants/Env';
import styles from './Footer.module.scss';
import { Paragraph } from '../../../ui/paragraph';

export const Footer = async (): Promise<React.JSX.Element> => {
  const t = await getTranslations('footer');
  const locale = await getLocale();
  const updatedAt = new Date(`${DATA_LAST_UPDATED_AT}T00:00:00Z`);

  return (
    <footer className={styles.footer}>
      <p className={styles.lastUpdated}>
        {t('lastUpdated')}{' '}
        <time dateTime={DATA_LAST_UPDATED_AT}>
          {new Intl.DateTimeFormat(locale === 'bos' ? 'bs' : locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
          }).format(updatedAt)}
        </time>
      </p>
      <Paragraph fontSize="16" className={styles.copyright}>
        {t('copyright')}
      </Paragraph>
    </footer>
  );
};
