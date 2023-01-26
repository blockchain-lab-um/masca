import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/no-extraneous-dependencies
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const ToggleTheme = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      className={`h-[32px] w-[32px] tablet:h-[38px] tablet:w-[38px] p-1 m-2 flex justify-center items-center rounded-full hover:bg-orange/30 animated-transition ${
        resolvedTheme === 'dark' ? 'text-white/50' : 'text-black/50'
      }`}
      type="button"
      onClick={toggleTheme}
    >
      {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default ToggleTheme;
