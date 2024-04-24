import '@/styles/globals.css';

// import { cn } from '@/utils/shadcn';
import { cn } from '@/utils/shadcn';
import type { Metadata } from 'next';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Cabin, JetBrains_Mono, Ubuntu } from 'next/font/google';

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
  keywords: [
    'Masca',
    'MetaMask',
    'Snaps',
    'Self-Sovereign Identity',
    'Next.js',
    'Credential Management',
    'Web3',
    'DIDs',
  ],
  openGraph: {
    title: 'Masca',
    description: 'Masca is a decentralized credential management platform.',
    locale: 'en_US',
    url: 'https://masca.io',
    siteName: 'Masca',
    images: [
      {
        url: 'https://masca.io/api/og',
        width: 1920,
        height: 1080,
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
    shortcut: '/favicon.ico',
  },
  verification: {
    google: 'snsvYv9eAKOZ7FrIjpUSnUtqgoFiSXQWROVrStPBc8I',
  },
  manifest: null,
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html suppressHydrationWarning lang={params.locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={cn(
          `${cabin.variable} ${ubuntu.variable} ${jetBrainsMono.variable} font-cabin`,
          'h-screen min-h-screen w-screen overflow-x-hidden overflow-y-visible',
          'main-bg'
        )}
      >
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
