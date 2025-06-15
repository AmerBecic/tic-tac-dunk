import { Header } from '@/components/shared/header';

import styles from './styles.module.scss';

const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <div className={styles.layoutContainer}>
      <Header />

      <main>{children}</main>

      <div>
        <p>Footer</p>
      </div>
    </div>
  );
};

export default MainLayout;
