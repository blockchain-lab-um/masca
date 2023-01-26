import React from 'react';
import { useRouter } from 'next/router';

type NavBtnProps = {
  page: string;
  children: React.ReactNode;
};

export const NavBtn = ({ page, children }: NavBtnProps) => {
  const router = useRouter();
  return (
    <button
      className={`nav-btn ${
        router.pathname === page
          ? 'text-orange after:w-[100%]'
          : 'dark:text-white'
      }`}
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(page);
      }}
    >
      {children}
    </button>
  );
};
