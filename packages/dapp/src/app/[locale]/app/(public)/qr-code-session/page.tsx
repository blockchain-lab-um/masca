import { Metadata } from 'next';

import { QRCodeScannerDisplay } from '@/components/QRScannerDisplay';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard for Masca Dapp.',
};

export default function Page() {
  return <QRCodeScannerDisplay />;
}
