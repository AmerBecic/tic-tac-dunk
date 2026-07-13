import { Header } from '@/features/shared/header';

import styles from './styles.module.scss';
import React from 'react';
import { Footer } from '../../footer';

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
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
