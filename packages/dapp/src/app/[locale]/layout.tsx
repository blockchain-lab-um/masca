import '@/styles/globals.css';

import { Metadata } from 'next';
import { Cabin, JetBrains_Mono, Ubuntu } from 'next/font/google';
import { notFound } from 'next/navigation';
import clsx from 'clsx';
import { NextIntlClientProvider } from 'next-intl';

import AnalyticsWrapper from '@/components/AnalyticsWrapper';
import ThemeProvider from '@/components/ThemeProvider';

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
          'h-screen min-h-screen',
          'main-bg'
        )}
      >
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <ThemeProvider>
            <div className="flex h-full">
              <div className="flex-1 overflow-hidden">{children}</div>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
