import { Head, Html, Main, NextScript } from 'next/document';

import { BASE_PATH } from '@/utils/constants';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href={`${BASE_PATH}/images/ssi_icon_b.png`} />
      </Head>
      <body className="bg-gradient min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
