import Head from 'next/head';
import Contact, { data } from '../components/Contact';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout navSafe>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={data.metaDescription} />
      </Head>
      <div className="flex items-center w-full h-screen max-w-lg px-2 md:max-w-2xl">
        <Contact {...data} />
      </div>
    </Layout>
  );
};
export default Home;
