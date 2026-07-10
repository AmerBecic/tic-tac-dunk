import { useTranslations } from 'next-intl';
import { NavbarLink } from '../nav-bar-link';
import { NAVIGATION } from '@/constants/pages';
import styles from './styles.module.scss';

export const DesktopNav = (): React.JSX.Element => {
  const t = useTranslations('header');

  return (
    <div>
      <nav className={styles.nav}>
        {NAVIGATION.map(
          ({ titleKey, href }): React.JSX.Element => (
            <NavbarLink key={titleKey} href={href}>
              {t(titleKey)}
            </NavbarLink>
          )
        )}
      </nav>
    </div>
  );
};
