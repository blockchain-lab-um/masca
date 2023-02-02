import Link from 'next/link';
import Button from '../components/Button';

export default function Home() {
  return (
    <>
      <main>
        <div className="flex text-center flex-col my-auto items-center pt-32">
          <div className="text-h3 sm:text-h2 lg:text-h1 font-ubuntu ">
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
      </main>
    </>
  );
}
