import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';

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
      className={`animated-transition dark:hover:bg-navy-blue-800 dark:text-navy-blue-400 m-2 flex h-[32px] w-[32px] items-center justify-center rounded-full p-1 hover:bg-orange-100 lg:h-[38px] lg:w-[38px] ${
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
