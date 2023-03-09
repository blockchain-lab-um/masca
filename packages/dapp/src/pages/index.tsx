import Link from 'next/link';

import Button from '../components/Button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center mt-[30vh]">
      <div className="absolute  left-[-14vw] bottom-[-10vw] w-[50vw] h-[50vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
      <div className="absolute  left-[14vw] bottom-[-8vw] w-[30vw] h-[30vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>
      <div className="absolute  left-[-5vw] bottom-[-5vw] w-[25vw] h-[25vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
      <div className="absolute  right-[-8vw] bottom-[-5vw] w-[25vw] h-[25vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>

      <div className="absolute left-[35vw] bottom-[30vw] flex justify-center items-center">
        <div className="absolute w-[13vw] h-[13vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
        <div className="absolute w-[10vw] h-[10vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
        <div className="absolute w-[7vw] h-[7vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
      </div>

      <div className="absolute right-[30vw] bottom-[40vw] flex justify-center items-center">
        <div className="absolute w-[13vw] h-[13vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>
        <div className="absolute w-[10vw] h-[10vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>
        <div className="absolute w-[7vw] h-[7vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>
      </div>

      <div className="absolute  left-[23vw] top-[0vw] w-[20vw] h-[20vw] rounded-full bg-pink-500 opacity-10 -z-10"></div>
      <div className="absolute  left-[30vw] top-[6vw] w-[11vw] h-[11vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>

      <div className="absolute  right-[13vw] top-[-35vw] w-[50vw] h-[50vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>
      <div className="absolute  right-[-12vw] top-[-20vw] w-[60vw] h-[60vw] rounded-full bg-orange-500 opacity-10 -z-10"></div>

      <div className="text-h3 sm:text-h2 lg:text-h1 font-ubuntu font-bold ">
        Take Control of Your{' '}
        <span className="text-orange-500">Online Identity</span>
      </div>

      <div className="text-lg sm:text-xl lg:text-2xl pt-8 text-gray-80 dark:text-orange-500-60">
        Join the world of Self-Sovereign Identity with one click
      </div>
      <div className="pt-16">
        <Link href="/dashboard">
          <Button variant="primary" size="lg" shadow="lg">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
