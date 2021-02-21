import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Moon from './icons/Moon.svg';
import Sun from './icons/Sun.svg';

const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true));
  return (
    mounted && (
      <button
        type="button"
        className="w-6 h-6 fill-current focus:outline-none focus:text-blue-600 hover:text-blue-600 dark:focus:text-blue-100 dark:hover:text-blue-100"
        aria-label="Theme"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Moon /> : <Sun />}
      </button>
    )
  );
};

export default ThemeToggle;
