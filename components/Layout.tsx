import Head from 'next/head';
import PropTypes from 'prop-types';
import { capitalize } from '../lib/string';
import Navigation from './Navigation';
import ScrollTop from './ScrollTop';

export const siteTitle = 'laymonage';
export const propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export type LayoutProps = PropTypes.InferProps<typeof propTypes>;

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const pageTitle = ((title && `${capitalize(title)} | `) || '') + siteTitle;
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="laymonage's personal website" />
        <meta name="og:title" content={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Navigation />
      <main className="container flex w-full min-h-screen mx-auto">{children}</main>
      <div className="fixed top-0 left-0 w-screen h-screen duration-500 bg-white bg-center bg-cover dark:bg-gray-900 bg ease" />
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
Layout.propTypes = propTypes;
export default Layout;
