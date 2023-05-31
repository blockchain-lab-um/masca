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
  '/verifiable-credential': {
    title: 'Verifiable Credential',
    description: 'Verifiable Credential page for Masca.',
  },
  '/create-verifiable-presentation': {
    title: 'Verifiable Presentation',
    description: 'Create erifiable Presentation page for Masca.',
  },
  '/get-credential': {
    title: 'Get Credential',
    description: 'Get Credential page for Masca.',
  },
  '/authorization-request': {
    title: 'Authorization Request',
    description: 'Authorization Request page for Masca.',
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
            <div className="mx-4 flex h-full flex-col pt-4 lg:mx-8 xl:mx-16">
              <Navbar />
              <div className="flex-1 pt-24">{children}</div>
            </div>
          </ToastWrapper>
          <Footer />
        </>
      </div>
    </>
  );
};

export default Layout;
