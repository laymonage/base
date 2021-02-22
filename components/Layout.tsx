import Head from 'next/head';
import cn from 'classnames';
import { ReactNode } from 'react';
import { capitalize } from '../lib/string';
import Navigation from './Navigation';
import ScrollTop from './ScrollTop';

export const siteTitle = 'laymonage';
export interface LayoutProps {
  children: ReactNode;
  title?: string;
  navSafe?: boolean;
}

const Layout = ({ children, title, navSafe }: LayoutProps) => {
  const pageTitle = ((title && `${capitalize(title)} | `) || '') + siteTitle;
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <meta name="description" content="laymonage's personal website" />
        <meta name="og:title" content={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Navigation />
      <main
        className={cn(
          'container flex flex-col items-center w-full min-h-screen mx-auto max-w-3xl',
          {
            'mt-2 mb-16 sm:mt-32': !navSafe,
          },
        )}
      >
        {children}
      </main>
      <div className="fixed top-0 left-0 w-screen h-screen bg-white bg-center bg-cover dark:bg-gray-900 bg" />
      <style jsx>
        {`
          .bg {
            background-image: url('/bg.svg');
            z-index: -1;
            content: '';
            will-change: transform;
          }
        `}
      </style>
      <ScrollTop />
    </>
  );
};
export default Layout;
