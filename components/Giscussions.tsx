import Head from 'next/head';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const themeMapping = {
  light: 'light',
  dark: 'dark_dimmed',
  system: 'preferred_color_scheme',
};

export default function Giscussions() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return !mounted ? null : (
    <>
      <Head>
        <script
          src="https://giscussions.vercel.app/client.js"
          data-repo="laymonage/base"
          data-repo-id="MDEwOlJlcG9zaXRvcnkzNDExNDE2OTY="
          data-category-id="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyNzIzMDI4"
          data-mapping="pathname"
          data-theme={themeMapping[theme] || 'light'}
          crossOrigin="anonymous"
          async
        />
      </Head>
      <div className="giscussions" />
    </>
  );
}
