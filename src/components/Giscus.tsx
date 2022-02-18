import { useTheme } from 'next-themes';
import Head from 'next/head';
import { useEffect, useState } from 'react';

const themeMapping = {
  light: 'light',
  dark: 'transparent_dark',
};

export default function Giscus() {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const theme = themeMapping[resolvedTheme as keyof typeof themeMapping];

  useEffect(() => {
    import('giscus');
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Head>
        {Object.values(themeMapping).map((theme) => (
          <link
            key={theme}
            rel="prefetch"
            href={`https://giscus.app/themes/${theme}.css`}
            as="style"
            type="text/css"
            crossOrigin="anonymous"
          />
        ))}
      </Head>
      <giscus-widget
        repo="laymonage/base"
        repoid="MDEwOlJlcG9zaXRvcnkzNDExNDE2OTY"
        category="Comments"
        categoryid="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyNzIzMDI4"
        theme={theme}
        mapping="pathname"
        reactionsenabled="1"
        emitmetadata="0"
        inputposition="bottom"
        lang="en"
      />
    </>
  );
}
