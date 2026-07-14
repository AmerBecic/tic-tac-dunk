import { NavbarLink } from '../nav-bar-link';
import { NAVIGATION } from '@/core/constants/pages';
import styles from './styles.module.scss';
import { getTranslations } from 'next-intl/server';

export const DesktopNav = async (): Promise<React.JSX.Element> => {
  const t = await getTranslations('header');

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
