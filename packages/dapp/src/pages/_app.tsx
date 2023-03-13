import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Cabin, JetBrains_Mono, Ubuntu } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import Layout from '@/components/Layout';
import MetaMaskProvider from '@/components/MetaMaskProvider';

const cabin = Cabin({
  variable: '--font-cabin',
  display: 'swap',
});

const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  display: 'swap',
  weight: ['400', '500', '700'],
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <div
        className={`${cabin.variable} ${ubuntu.variable} ${jetBrainsMono.variable} font-cabin`}
      >
        <Layout>
          <MetaMaskProvider>
            <Component {...pageProps} />
          </MetaMaskProvider>
        </Layout>
      </div>
    </ThemeProvider>
  );
}
