import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href={'/images/ssi_icon_b.png'} />
      </Head>
      <body className="bg-gradient min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
