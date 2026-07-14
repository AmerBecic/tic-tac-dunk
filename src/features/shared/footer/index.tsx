import { Logo } from '../logo';
import { Paragraph } from '../../../features/shared/ui/paragraph';
import styles from './styles.module.scss';
import { getTranslations } from 'next-intl/server';

export const Footer = async (): Promise<React.JSX.Element> => {
  const t = await getTranslations('footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <div className={styles.desktopOnly}>
          <Logo />
        </div>
        <Paragraph>{t('description')}</Paragraph>
      </div>

      <Paragraph className={styles.copyright}>{t('copyright')}</Paragraph>
    </footer>
  );
};
