import React from 'react';
import Link from 'next/link';

type NavBtnProps = {
  page: string;
  pathname: string;
  children: React.ReactNode;
};

export const NavBtn = ({ page, pathname, children }: NavBtnProps) => {
  return (
    <Link href={page}>
      <button
        className={`nav-btn ${
          pathname === page
            ? 'font-bold text-pink-500 after:w-[100%] dark:text-pink-400'
            : 'dark:text-navy-blue-tone/80 text-gray-600'
        }`}
      >
        {children}
      </button>
    </Link>
  );
};
