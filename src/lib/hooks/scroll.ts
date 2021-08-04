import { useEffect, useState } from 'react';

export const useScrollY = (): number => {
  const [scrollY, setScrollY] = useState(0);
  const handleScroll = () => setScrollY(window.scrollY || window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
};
