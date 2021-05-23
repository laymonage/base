import clsx from 'clsx';
import { useScrollY } from 'lib/hooks/scroll';

const ScrollTop = () => {
  const offset = 256;
  const scrollY = useScrollY();

  return (
    <button
      type="button"
      className={clsx(
        'fixed z-10 text-white transition-transform duration-300 bg-blue-900 rounded-full bottom-3 right-3 button dark:bg-gray-700 focus:outline-none transform translate-y-0',
        { 'translate-y-20': offset > scrollY, 'shadow-lg': offset <= scrollY },
      )}
    >
      <svg
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-12 h-12 fill-current sm:w-16 sm:h-16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M17 13.41l-4.29-4.24a1 1 0 00-1.42 0l-4.24 4.24a1 1 0 000 1.42 1 1 0 001.41 0L12 11.29l3.54 3.54a1 1 0 00.7.29 1 1 0 00.71-.29 1 1 0 00.05-1.42z" />
      </svg>
    </button>
  );
};
export default ScrollTop;
