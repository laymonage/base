import { useMounted } from '@/lib/hooks/mounted';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { Moon, Sun } from 'react-feather';

export default function ThemeToggle() {
  const mounted = useMounted();
  const { resolvedTheme: theme, setTheme } = useTheme();

  const handleThemeChange = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [setTheme, theme],
  );

  return mounted ? (
    <button
      type="button"
      className="alike h-6 w-6 fill-current focus:outline-none"
      aria-label="Change theme"
      onClick={handleThemeChange}
    >
      {theme === 'dark' ? (
        <Moon width={24} height={24} fill="currentColor" />
      ) : (
        <Sun width={22} height={22} strokeWidth={2.5} />
      )}
    </button>
  ) : null;
}
