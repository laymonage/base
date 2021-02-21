import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

const App: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
