import { useState } from 'react';
import clsx from 'clsx';
import { Menu, X } from 'react-feather';
import Link from '@/components/Link';
import { useScrollY } from '@/lib/hooks/scroll';
import Logo from './icons/Logo.svg';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [hidden, setHidden] = useState(false);
  const scrollY = useScrollY();
  const hideOffset = 60;

  if (Math.abs(scrollY - lastScroll) > hideOffset) {
    setHidden(scrollY >= lastScroll);
    setLastScroll(scrollY);
  }

  const menu = ['posts', 'thoughts', 'projects', 'palates', 'about'];
  return (
    <nav role="navigation" className="mx-auto max-w-4xl">
      <div
        className={clsx(
          'ease fixed bottom-0 z-20 flex w-full max-w-4xl transform flex-col-reverse bg-white bg-opacity-50 py-3 backdrop-blur backdrop-filter transition-transform duration-300 dark:bg-gray-800 dark:bg-opacity-50 sm:top-0 sm:bottom-auto sm:flex-row sm:items-center sm:justify-between',
          hidden ? 'translate-y-full sm:-translate-y-full' : 'shadow',
        )}
      >
        <div className="mx-4 flex flex-grow items-center justify-between">
          <Link
            href="/"
            aria-label="Home"
            className="mr-2 h-10 w-10 fill-current text-blue-700 focus:outline-none dark:text-blue-100"
          >
            <Logo />
          </Link>
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <button
              aria-label="Toggle navigation menu"
              type="button"
              className="alike ml-4 h-6 w-6 fill-current focus:outline-none sm:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? <X strokeWidth={2.5} /> : <Menu strokeWidth={2.5} />}
            </button>
          </div>
        </div>
        <div
          className={clsx(
            'mr-0 px-3 pb-2 sm:mr-4 sm:flex sm:items-center sm:p-0',
            {
              hidden: !open,
            },
          )}
        >
          {menu.map((m) => (
            <Link
              href={`/${m}`}
              key={m}
              className="mb-2 block rounded p-2 font-semibold capitalize hover:bg-blue-100 hover:bg-opacity-50 focus:bg-blue-100 focus:bg-opacity-50 focus:outline-none dark:hover:bg-gray-700 dark:hover:bg-opacity-50 dark:focus:bg-gray-700 dark:focus:bg-opacity-50 sm:mb-0 sm:ml-4 sm:first:ml-0"
            >
              {m}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
