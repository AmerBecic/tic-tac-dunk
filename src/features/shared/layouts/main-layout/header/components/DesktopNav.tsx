import { NAVIGATION } from '@/core/constants/pages';
import styles from './DesktopNav.module.scss';
import { getTranslations } from 'next-intl/server';
import { NavbarLink } from '.';

export const DesktopNav = async (): Promise<React.JSX.Element> => {
  const t = await getTranslations('pages');

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
