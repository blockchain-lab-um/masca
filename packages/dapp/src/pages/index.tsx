import { useRouter } from 'next/router';
import Button from '../components/Button';

export default function Home() {
  const router = useRouter();
  return (
    <>
      <main>
        <div className="flex text-center flex-col my-auto items-center pt-32">
          <h1 className="text-h3 mobile:text-h2 tablet:text-h1 font-ubuntu">
            Take Control of Your Online Identity
          </h1>

          <h2 className="text-lg mobile:text-xl tablet:text-2xl pt-8">
            Join the world of Self-Sovereign Identity with one click
          </h2>
          <div className="pt-16">
            <Button
              className="btn-primary desktop:text-h3"
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                router.push('/dashboard');
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
