'use client';

import { Link } from '@/features/shared/ui/link';
import { usePathname } from 'next/navigation';

import styles from './NavbarLink.module.scss';
import React from 'react';

interface NavbarLinkProps {
  children: React.ReactNode;
  href: string;
  onClick?: () => void;
}

export const NavbarLink = ({
  children,
  href = '#',
  onClick,
}: NavbarLinkProps): React.JSX.Element => {
  const pathname = usePathname();
  const isActive = pathname.endsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${styles.navLink} ${isActive ? styles.active : ''}`}
    >
      {children}
    </Link>
  );
};
