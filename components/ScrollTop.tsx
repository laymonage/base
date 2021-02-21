import cn from 'classnames';
import { useEffect, useState } from 'react';

const ScrollTop: React.FC = () => {
  const offset = 256;
  const [scrollY, setScrollY] = useState(0);
  const handleScroll = () => setScrollY(window.scrollY || window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <button
      type="button"
      className={cn(
        'fixed z-10 text-white transition duration-300 bg-blue-900 rounded-full shadow-lg bottom-3 right-3 button dark:bg-gray-700 focus:outline-none',
        { 'button-hidden': offset > scrollY },
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
      <style jsx>
        {`
          .button {
            transform: translate3d(0, 0, 0);
          }

          .button.button-hidden {
            box-shadow: none;
            transform: translate3d(0, 150%, 0);
          }
        `}
      </style>
    </button>
  );
};
export default ScrollTop;
