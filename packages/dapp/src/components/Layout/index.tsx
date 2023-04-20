import { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ToastWrapper } from './ToastWrapper';

const METADATA: { [key: string]: { title: string; description: string } } = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Dashboard page for Masca.',
  },
  '/settings': {
    title: 'Settings',
    description: 'Settings page for Masca.',
  },
  '/vc': {
    title: 'VC',
    description: 'VC page for Masca.',
  },
  '/createVP': {
    title: 'Verifiable Presentation',
    description: 'Create VP page for Masca.',
  },
} as const;

const Layout = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();

  const metadata = useMemo(() => METADATA[router.pathname], [router.pathname]);

  return (
    <>
      <Head>
        <title>{`Masca${metadata ? ` | ${metadata.title}` : ''}`}</title>
      </Head>
      <div className="flex h-screen flex-col">
        <>
          <ToastWrapper>
            <div className="mx-4 mt-4 lg:mx-8 xl:mx-16">
              <Navbar />
              <div className="my-8 mt-4 lg:mt-24">{children}</div>
            </div>
          </ToastWrapper>
          <Footer />
        </>
      </div>
    </>
  );
};

export default Layout;
