import { useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import Logo from './icons/Logo.svg';
import Bars from './icons/Bars.svg';
import Times from './icons/Times.svg';
import ThemeToggle from './ThemeToggle';

const Navigation: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScroll, setLastScroll] = useState(0);
  const [hidden, setHidden] = useState(false);
  const hideOffset = 60;

  const handleScroll = () => {
    setScrollY(window.scrollY || window.pageYOffset);
    if (Math.abs(scrollY - lastScroll) > hideOffset) {
      setHidden(scrollY >= lastScroll);
      setLastScroll(scrollY);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const menu = ['posts', 'projects'];
  return (
    <nav
      role="navigation"
      className={cn(
        'fixed bottom-0 z-20 flex flex-col-reverse w-full py-3 transition duration-500 transform bg-white sm:flex-row sm:justify-between sm:items-center dark:bg-gray-800 dark:text-blue-200 ease sm:top-0 sm:bottom-auto',
        { 'shadow-md': !hidden, 'translate-y-full': hidden, 'sm:-translate-y-full': hidden },
      )}
    >
      <div className="flex items-center justify-between flex-grow mx-4">
        <Link href="/" aria-current aria-label="Home">
          <a
            tabIndex={-1}
            className="w-10 h-10 text-blue-700 fill-current focus:outline-none dark:text-blue-100"
          >
            <Logo />
          </a>
        </Link>
        <div className="flex items-center justify-between text-blue-700 dark:text-blue-200">
          <ThemeToggle />
          <button
            type="button"
            className="w-8 h-8 ml-4 fill-current sm:hidden focus:outline-none focus:text-blue-600 hover:text-blue-600 dark:focus:text-blue-100 dark:hover:text-blue-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <Times /> : <Bars />}
          </button>
        </div>
      </div>
      <div className={cn('px-2 pb-2 sm:p-0 sm:mr-4 sm:flex sm:items-center', { hidden: !open })}>
        {menu.map((m, i) => (
          <Link href={`/${m}`} key={i}>
            <a className="block p-2 mb-2 font-bold capitalize rounded sm:mb-0 first:mb-1 sm:first:mb-0 sm:ml-4 sm:first:ml-0 focus:outline-none focus:bg-blue-100 hover:bg-blue-100 dark:focus:bg-gray-700 dark:hover:bg-gray-700">
              {m}
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
};
export default Navigation;
