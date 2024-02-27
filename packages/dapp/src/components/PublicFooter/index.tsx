import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="flex w-full flex-1 items-center justify-between p-4 md:p-12 text-xs sm:text-xs">
      <p>&copy; 2024 Lutra Labs</p>
      <div className="flex">
        <Link href="/privacy" className="ml-4">
          Privacy Policy
        </Link>
        <Link href="/tos" className="ml-4">
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
