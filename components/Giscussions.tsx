import Head from 'next/head';
import { useMounted } from 'lib/hooks/mounted';
import { useTheme } from 'next-themes';

const themeMapping = {
  light: 'light',
  dark: 'dark_dimmed',
  system: 'preferred_color_scheme',
};

export default function Giscussions() {
  const mounted = useMounted();
  const { theme = 'light' } = useTheme();

  return !mounted ? null : (
    <>
      <Head>
        <script
          src="https://giscus.vercel.app/client.js"
          data-repo="laymonage/base"
          data-repo-id="MDEwOlJlcG9zaXRvcnkzNDExNDE2OTY="
          data-category-id="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyNzIzMDI4"
          data-mapping="pathname"
          data-theme={themeMapping[theme as keyof typeof themeMapping]}
          crossOrigin="anonymous"
          async
        />
      </Head>
      <div className="giscus" />
    </>
  );
}
