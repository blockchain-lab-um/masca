import { Metadata } from 'next';

import LandingPage from '@/components/LandingPage';

export const metadata: Metadata = {
  title: 'Settings',
  description: "Settings page for changing Masca's configuration.",
};

export default function Home() {
  return <LandingPage />;
}
