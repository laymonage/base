import 'tailwindcss/tailwind.css';
import 'styles/globals.css';
import 'styles/markdown.scss';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
};
export default App;
