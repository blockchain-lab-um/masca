import '@/styles/globals.css';

import { Metadata } from 'next';
import { Cabin, JetBrains_Mono, Ubuntu } from 'next/font/google';
import { notFound } from 'next/navigation';
import clsx from 'clsx';
import { NextIntlClientProvider } from 'next-intl';

import Footer from '@/components/Footer';
import MetaMaskProvider from '@/components/MetaMaskProvider';
import Navbar from '@/components/Navbar';
import ThemeProvider from '@/components/ThemeProvider';
import ToastWrapper from '@/components/ToastWrapper';

const cabin = Cabin({
  variable: '--font-cabin',
  display: 'swap',
  subsets: ['latin-ext'],
});

const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  display: 'swap',
  weight: ['400', '500', '700'],
  subsets: ['latin-ext'],
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  display: 'swap',
  subsets: ['latin-ext'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://masca.io'),
  title: {
    default: 'Masca',
    template: '%s | Masca',
  },
  description: 'Masca is a decentralized credential management platform.',
  openGraph: {
    title: 'Masca',
    description: 'Masca is a decentralized credential management platform.',
    locale: 'en_US',
    url: 'https://masca.io',
    siteName: 'Masca',
    images: [
      {
        url: 'https://masca.xyz/images/masca_black.png',
        width: 211,
        height: 186,
        alt: 'Masca Logo',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  twitter: {
    title: 'Masca',
    card: 'summary_large_image',
  },
  icons: {
    shortcut: '/images/masca_black.png',
  },
  verification: {
    google: 'snsvYv9eAKOZ7FrIjpUSnUtqgoFiSXQWROVrStPBc8I',
  },
};

export function generateStaticParams() {
  return [{ locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;

  try {
    messages = (await import(`../../messages/${params.locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={params.locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={clsx(
          `${cabin.variable} ${ubuntu.variable} ${jetBrainsMono.variable} font-cabin`,
          'bg-gradient min-h-screen'
        )}
      >
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <ThemeProvider>
            <div className="flex h-screen flex-col">
              <ToastWrapper>
                <div className="mx-4 flex h-full flex-col pt-4 lg:mx-8 xl:mx-16">
                  <Navbar />
                  <div className="flex-1 pt-24">
                    <MetaMaskProvider>{children}</MetaMaskProvider>
                  </div>
                </div>
              </ToastWrapper>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}