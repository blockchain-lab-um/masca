import { Metadata } from 'next';

import QRCodeSessionDisplay from '@/components/QRSessionDisplay';

export const metadata: Metadata = {
  title: 'QR Code Session',
  description: 'QR Code Session for Masca.',
};

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 w-full rounded-3xl bg-white shadow-lg md:max-w-4xl">
        <QRCodeSessionDisplay />
      </div>
    </div>
  );
}
