import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Moon from './icons/Moon.svg';
import Sun from './icons/Sun.svg';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState<boolean>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  return (
    mounted && (
      <button
        type="button"
        className="w-6 h-6 fill-current focus:outline-none alike"
        aria-label="Theme"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Moon /> : <Sun />}
      </button>
    )
  );
};
export default ThemeToggle;
