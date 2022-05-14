import { useTheme } from 'next-themes';
import Head from 'next/head';
import GiscusComponent from '@giscus/react';

const themeMapping = {
  light: 'light',
  dark: 'transparent_dark',
};

export default function Giscus() {
  const { resolvedTheme } = useTheme();
  const theme = themeMapping[resolvedTheme as keyof typeof themeMapping];

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
      <GiscusComponent
        repo="laymonage/base"
        repoId="MDEwOlJlcG9zaXRvcnkzNDExNDE2OTY"
        category="Comments"
        categoryId="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyNzIzMDI4"
        theme={theme}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        lang="en"
      />
    </>
  );
}
