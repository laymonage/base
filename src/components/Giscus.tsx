import { useState } from 'react';
import { useTheme } from 'next-themes';
import Head from 'next/head';
import GiscusComponent from '@giscus/react';

const themeMapping = {
  light: 'light',
  dark: 'transparent_dark',
};

interface GiscusProps {
  eager?: boolean;
}

export default function Giscus({ eager = false }: GiscusProps) {
  const { resolvedTheme } = useTheme();
  const [shown, setShown] = useState(eager);
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
      {shown ? (
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
      ) : (
        <button
          type="button"
          className="hover rounded bg-gray-100 py-2 px-4 text-center text-base text-gray-600 hover:bg-gray-200  hover:text-gray-800 focus:bg-gray-200 focus:text-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:text-white"
          onClick={() => setShown(true)}
        >
          Load comments
        </button>
      )}
    </>
  );
}
