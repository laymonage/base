import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

const themeMapping = {
  light: 'light',
  dark: 'transparent_dark',
};

export default function Giscus() {
  const { resolvedTheme } = useTheme();
  const theme = useRef(resolvedTheme);

  useEffect(() => {
    const hasLoaded = theme.current && theme.current !== resolvedTheme;
    if (!resolvedTheme || hasLoaded) return;

    theme.current = resolvedTheme;

    const script = document.createElement('script');
    const attributes = {
      src: 'https://giscus.app/client.js',
      id: 'giscus-script',
      'data-repo': 'laymonage/base',
      'data-repo-id': 'MDEwOlJlcG9zaXRvcnkzNDExNDE2OTY',
      'data-category-id': 'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyNzIzMDI4',
      'data-mapping': 'pathname',
      'data-theme': themeMapping[resolvedTheme as keyof typeof themeMapping],
      crossOrigin: 'anonymous',
      async: '',
    };

    Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value));
    document.body.appendChild(script);

    return () => {
      const existingScript = document.body.querySelector('#giscus-script');
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, [resolvedTheme]);

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme: themeMapping[resolvedTheme as keyof typeof themeMapping],
          },
        },
      },
      'https://giscus.app',
    );
  }, [resolvedTheme]);

  return <div className="giscus" />;
}
