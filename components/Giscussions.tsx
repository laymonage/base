import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import IframeResizer from 'iframe-resizer-react';

export default function Giscussions() {
  const router = useRouter();
  const [session, setSession] = useState('');
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (router.query.giscussions && !session) {
    setSession(router.query.giscussions as string);
    router.replace(
      {
        pathname: router.pathname,
        query: { slug: router.query.slug },
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      },
    );
  }

  const params = new URLSearchParams({
    repo: 'laymonage/base',
    term: router.asPath,
    origin: `${window.location.origin}${router.asPath}`,
    giscussions: session,
    theme: theme === 'light' ? 'light' : 'dark_dimmed',
  });

  return (
    <IframeResizer
      checkOrigin={false}
      className="w-full"
      src={`https://giscussions.vercel.app/widget?${params}`}
    />
  );
}
