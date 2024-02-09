import { useMounted } from '@/lib/hooks/mounted';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { IconMoonFilled, IconSun } from '@tabler/icons-react';

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
        <IconMoonFilled width={24} height={24} fill="currentColor" />
      ) : (
        <IconSun width={22} height={22} strokeWidth={2.5} />
      )}
    </button>
  ) : null;
}
