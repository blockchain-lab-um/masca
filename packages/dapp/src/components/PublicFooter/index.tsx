'use client';

import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

interface PublicFooterProps {
  setIsMenuOpen: Dispatch<SetStateAction<boolean>> | null | undefined;
}

export default function PublicFooter({ setIsMenuOpen }: PublicFooterProps) {
  return (
    <footer className="flex h-full w-full flex-1 items-end justify-between text-xs md:text-sm">
      <p>&copy; 2024 Lutra Labs</p>
      <div className="flex space-x-6 max-sm:flex-col max-sm:space-x-0 max-sm:text-right">
        <Link
          href="/privacy"
          onClick={() => {
            if (setIsMenuOpen) {
              setIsMenuOpen(false);
            }
          }}
        >
          Privacy Policy
        </Link>
        <Link
          href="/tos"
          onClick={() => {
            if (setIsMenuOpen) {
              setIsMenuOpen(false);
            }
          }}
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
