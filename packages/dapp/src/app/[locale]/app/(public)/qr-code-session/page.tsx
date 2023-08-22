import { Metadata } from 'next';

import QRCodeSessionDisplay from '@/components/QRSessionDisplay';

export const metadata: Metadata = {
  title: 'QR Code Session',
  description: 'QR Code Session for Masca.',
};

export default function Page() {
  return <QRCodeSessionDisplay />;
}
