if (process.env.NODE_ENV === 'development') {
  import('preact/debug');
}

import 'tailwindcss/tailwind.css';
import '@/styles/globals.scss';
import '@/styles/markdown.scss';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
