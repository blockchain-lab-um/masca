import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="font-cabin bg-gradient-to-t from-pink-20 to-orange-20 min-h-screen text-grey-80 dark:bg-gradient-to-t dark:from-black dark:to-black dark:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
