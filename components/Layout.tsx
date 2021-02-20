import Head from 'next/head';
import PropTypes from 'prop-types';

export const siteTitle = 'laymonage';

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="laymonage's personal website" />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <main className="container flex items-center w-full min-h-screen mx-auto">{children}</main>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
