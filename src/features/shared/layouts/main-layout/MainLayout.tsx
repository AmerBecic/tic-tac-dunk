import { Footer } from '../../footer';
import { Header } from '../../header';
import styles from './MainLayout.module.scss';
import React from 'react';

const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  return (
    <>
      <div className={styles.heroBackground} aria-hidden="true" />

      <div className={styles.layoutContainer}>
        <Header />

        <main>{children}</main>

        <div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
