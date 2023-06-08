import React from 'react';
import Link from 'next/link';

type NavBtnProps = {
  page: string;
  pathname: string;
  children: React.ReactNode;
};

export const NavBtn = ({ page, pathname, children }: NavBtnProps) => (
  <Link href={page}>
    <button
      className={`nav-btn ${
        pathname === page
          ? 'dark:text-orange-accent-dark text-pink-300'
          : 'dark:text-navy-blue-400 text-gray-600'
      }`}
    >
      {children}
    </button>
  </Link>
);
