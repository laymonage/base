import { useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { useScrollY } from 'lib/hooks/scroll';
import Logo from './icons/Logo.svg';
import Bars from './icons/Bars.svg';
import Times from './icons/Times.svg';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [hidden, setHidden] = useState(false);
  const scrollY = useScrollY();
  const hideOffset = 60;

  if (Math.abs(scrollY - lastScroll) > hideOffset) {
    setHidden(scrollY >= lastScroll);
    setLastScroll(scrollY);
  }

  const menu = ['posts', 'logs', 'projects', 'about'];
  return (
    <nav role="navigation" className="max-w-3xl mx-auto">
      <div
        className={cn(
          'fixed bottom-0 z-20 flex flex-col-reverse w-full max-w-3xl py-3 transition-transform duration-500 transform bg-white sm:flex-row sm:justify-between sm:items-center dark:bg-gray-800 ease sm:top-0 sm:bottom-auto',
          { 'shadow-md': !hidden, 'translate-y-full': hidden, 'sm:-translate-y-full': hidden },
        )}
      >
        <div className="flex items-center justify-between flex-grow mx-4">
          <Link href="/" aria-current aria-label="Home">
            <a className="w-10 h-10 mr-2 text-blue-700 fill-current focus:outline-none dark:text-blue-100">
              <Logo />
            </a>
          </Link>
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <button
              type="button"
              className="w-8 h-8 ml-4 fill-current sm:hidden focus:outline-none alike"
              onClick={() => setOpen(!open)}
            >
              {open ? <Times /> : <Bars />}
            </button>
          </div>
        </div>
        <div className={cn('px-3 pb-2 mr-4 sm:p-0 sm:flex sm:items-center', { hidden: !open })}>
          {menu.map((m) => (
            <Link href={`/${m}`} key={m}>
              <a className="block p-2 mb-2 font-bold capitalize rounded sm:mb-0 sm:ml-4 sm:first:ml-0 focus:outline-none focus:bg-blue-100 hover:bg-blue-100 dark:focus:bg-gray-700 dark:hover:bg-gray-700">
                {m}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
