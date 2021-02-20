import Head from 'next/head';
import Contact, { data } from '../components/Contact';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={data.metaDescription} />
      </Head>
      <div className="w-11/12 mx-auto sm:w-10/12 lg:w-7/12 xl:w-6/12">
        <Contact />
      </div>
    </Layout>
  );
};

export default Home;
