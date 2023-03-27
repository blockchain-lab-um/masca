import Head from 'next/head';
import Link from 'next/link';

import Button from '../components/Button';

export default function Home() {
  return (
    <>
      <Head>
        <title>Masca | Home</title>
        <meta
          name="description"
          content="Masca is a decentralized credential management platform"
        />
      </Head>
      <div className="mt-[30vh] flex flex-col items-center justify-center text-center">
        <div className="text-h4 sm:text-h2 lg:text-h1 font-ubuntu dark:text-navy-blue-50 text-gray-900">
          Take control of your
          <span className="dark:text-pink-tone pl-1.5 text-pink-500">
            Online Identity
          </span>
        </div>
        <div className="text-h5 dark:text-navy-blue-50 sm:text-h4 lg:text-h3 dark:text-orange-500-60 font-ubuntu pt-8 text-gray-900">
          Join the world of
          <span className=" dark:text-text-pink-500 px-1.5 text-pink-500">
            Self - Sovereign Identity
          </span>
          with one click
        </div>
        <div className="pt-16">
          <Link href="/dashboard">
            <Button variant="white-pink" size="lg" shadow="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
