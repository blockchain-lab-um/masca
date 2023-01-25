import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

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
      className={`h-[28px] w-[28px] flex justify-center items-center rounded-lg bg-gray-200 dark:bg-gray-800 hover:outline-2 hover:outline hover:outline-gray-500
       ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
      type="button"
      onClick={toggleTheme}
    >
      {resolvedTheme === 'dark' ? 'D' : 'L'}
    </button>
  );
};

export default ToggleTheme;
