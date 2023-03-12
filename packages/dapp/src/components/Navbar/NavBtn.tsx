import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

type NavBtnProps = {
  page: string;
  children: React.ReactNode;
};

export const NavBtn = ({ page, children }: NavBtnProps) => {
  const router = useRouter();
  return (
    <Link href={page}>
      <button
        className={`nav-btn ${
          router.pathname === page
            ? 'text-pink-500 dark:text-pink-400 after:w-[100%] font-bold'
            : 'text-gray-700 dark:text-navy-blue-tone/80'
        }`}
      >
        {children}
      </button>
    </Link>
  );
};
