import { Metadata } from 'next';

import QRCodeScannerDisplay from '@/components/QRScannerDisplay';

export const metadata: Metadata = {
  title: 'QR Code Scanner',
  description: 'QR Code Scanner for Masca.',
};

export default function Page() {
  return <QRCodeScannerDisplay />;
}
