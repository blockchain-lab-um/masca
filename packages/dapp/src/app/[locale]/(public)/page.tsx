import { Metadata } from 'next';

import LandingPage from '@/components/LandingPage';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Home page the decentralized credential management platform Masca.',
};

export default function Page() {
  return <LandingPage />;
}
