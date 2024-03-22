import type { Metadata } from 'next';

import LandingPage from '@/components/LandingPage';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Home page of the decentralized credential management platform Masca.',
};

export default function Page() {
  return <LandingPage />;
}
