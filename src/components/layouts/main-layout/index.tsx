import { Header } from '@/components/shared/header';

import styles from './styles.module.scss';
import React from 'react';

const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
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
