import { Logo } from '../logo';
import { Paragraph } from '../../../features/shared/ui/paragraph';
import { useTranslations } from 'next-intl';
import styles from './styles.module.scss';

export const Footer = (): React.JSX.Element => {
  const t = useTranslations('footer');

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
