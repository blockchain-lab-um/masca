import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { Cabin, JetBrains_Mono, Ubuntu } from 'next/font/google';
import Head from 'next/head';
import { NextIntlProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

import Layout from '@/components/Layout';
import MetaMaskProvider from '@/components/MetaMaskProvider';

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="light"
      >
        <div
          className={`${cabin.variable} ${ubuntu.variable} ${jetBrainsMono.variable} font-cabin`}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
          <NextIntlProvider messages={pageProps.messages}>
            <Layout>
              <MetaMaskProvider>
                <Component {...pageProps} />
              </MetaMaskProvider>
            </Layout>
          </NextIntlProvider>
        </div>
      </ThemeProvider>
    </>
  );
}
