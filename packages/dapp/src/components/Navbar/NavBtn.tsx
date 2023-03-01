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
            ? 'text-orange-500 after:w-[100%]'
            : 'dark:text-white'
        }`}
      >
        {children}
      </button>
    </Link>
  );
};
