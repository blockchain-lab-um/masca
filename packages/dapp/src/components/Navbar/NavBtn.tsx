import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
            ? 'text-orange after:w-[100%]'
            : 'dark:text-white'
        }`}
      >
        {children}
      </button>
    </Link>
  );
};
