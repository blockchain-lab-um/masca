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
        {/* <div className="absolute  left-[-14vw] bottom-[-30%] w-[50vw] h-[50vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
      <div className="absolute  left-[14vw] bottom-[-25vh] w-[30vw] h-[30vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>
      <div className="absolute  left-[-8vw] bottom-[-15vh] w-[25vw] h-[25vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
      <div className="absolute  right-[-8vw] bottom-[-5vh] w-[25vw] h-[25vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>

      <div className="absolute left-[35vw] bottom-[30vh] flex justify-center items-center">
        <div className="absolute w-[13vw] h-[13vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
        <div className="absolute w-[10vw] h-[10vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
        <div className="absolute w-[7vw] h-[7vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
      </div>

      <div className="absolute right-[30vw] bottom-[50vh] flex justify-center items-center">
        <div className="absolute w-[13vw] h-[13vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>
        <div className="absolute w-[10vw] h-[10vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>
        <div className="absolute w-[7vw] h-[7vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>
      </div>

      <div className="absolute  left-[23vw] top-[0vh] w-[15vw] h-[15vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
      <div className="absolute  left-[28vw] top-[9vh] w-[8vw] h-[8vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>

      <div className="absolute  right-[13vw] top-[-55vh] w-[50vw] h-[50vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>
      <div className="absolute  right-[-20vw] top-[-30vh] w-[50vw] h-[50vw] rounded-full bg-orange-500 opacity-10 -z-10"></div> */}

        <div className="text-h4 sm:text-h2 lg:text-h1 font-ubuntu text-gray-900">
          Take control of your
          <span className="dark:text-orange-accent-dark pl-1.5 text-pink-500">
            Online Identity
          </span>
        </div>
        <div className="text-h5 sm:text-h4 lg:text-h3 dark:text-orange-500-60 font-ubuntu pt-8 text-gray-900">
          Join the world of
          <span className=" dark:text-orange-accent-dark px-1.5 text-pink-500">
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
