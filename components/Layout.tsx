import Head from 'next/head';
import PropTypes from 'prop-types';
import styles from '../styles/Home.module.css';

export const siteTitle = 'laymonage';

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="laymonage's personal website" />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <main className="flex items-center w-full min-h-screen">{children}</main>
      <footer className={styles.footer}>
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          Powered by <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
