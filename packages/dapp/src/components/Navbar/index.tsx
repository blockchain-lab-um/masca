import React from 'react';
import { useRouter } from 'next/router';
import ToggleTheme from '../ToggleTheme';

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="flex justify-between">
      <button
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          router.push('/');
        }}
      >
        <h1 className=" font-ubuntu text-h1 hover:text-orange animated-transition">
          Masca
        </h1>
      </button>
      <ToggleTheme />
    </div>
  );
}
