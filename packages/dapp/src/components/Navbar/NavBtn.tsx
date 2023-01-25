import React from 'react';
import { useRouter } from 'next/router';

export const NavBtn = (props) => {
  const router = useRouter();
  return (
    <button
      className={`nav-btn ${
        router.pathname === props.page
          ? 'text-orange after:w-[100%]'
          : 'dark:text-white'
      }`}
      onClick={() => {
        console.log(router.pathname, props.page);
        router.push(props.page);
      }}
    >
      {props.text}
    </button>
  );
};
