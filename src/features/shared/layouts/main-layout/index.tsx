import { Header } from '@/features/shared/header';

import styles from './styles.module.scss';
import React from 'react';
import { Footer } from '../../footer';
import { Image } from '@/features/shared/ui/image';

const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  return (
    <>
      <div className={styles.heroBackground}>
        <Image
          src="/hero-image.jpg"
          fill
          preload
          alt="Tic Tac Dunk Hero Image"
        />
      </div>
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
