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
      <div className="flex items-center w-11/12 mx-auto sm:w-10/12 lg:w-7/12 xl:w-6/12">
        <Contact {...data} />
      </div>
    </Layout>
  );
};
export default Home;
