import { useMounted } from 'lib/hooks/mounted';
import { useTheme } from 'next-themes';
import Moon from './icons/Moon.svg';
import Sun from './icons/Sun.svg';

const ThemeToggle = () => {
  const mounted = useMounted();
  const { resolvedTheme: theme, setTheme } = useTheme();

  return mounted ? (
    <button
      type="button"
      className="w-6 h-6 fill-current focus:outline-none alike"
      aria-label="Theme"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Moon /> : <Sun />}
    </button>
  ) : null;
};
export default ThemeToggle;
