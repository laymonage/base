import clsx from 'clsx';
import { useScrollY } from '@/lib/hooks/scroll';
import { useCallback } from 'react';

export default function ScrollTop() {
  const offset = 256;
  const scrollY = useScrollY();
  const doScroll = useCallback(
    () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    [],
  );

  return (
    <button
      aria-label="Scroll to top"
      type="button"
      className={clsx(
        'button fixed bottom-3 right-3 z-10 translate-y-0 transform rounded-full bg-blue-900 text-white transition-transform duration-300 focus:outline-none dark:bg-gray-700',
        offset > scrollY ? 'translate-y-20' : 'shadow-lg',
      )}
    >
      <svg
        onClick={doScroll}
        className="h-10 w-10 fill-current sm:h-16 sm:w-16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M17 13.41l-4.29-4.24a1 1 0 00-1.42 0l-4.24 4.24a1 1 0 000 1.42 1 1 0 001.41 0L12 11.29l3.54 3.54a1 1 0 00.7.29 1 1 0 00.71-.29 1 1 0 00.05-1.42z" />
      </svg>
    </button>
  );
}
