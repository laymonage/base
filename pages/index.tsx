import Contact, { data } from 'components/Contact';
import Layout from 'components/Layout';

const Home = () => {
  return (
    <Layout navSafe customMeta={{ description: data.metaDescription }}>
      <div className="flex items-center w-full h-screen max-w-lg px-2 sm:max-w-3xl">
        <Contact {...data} />
      </div>
    </Layout>
  );
};
export default Home;
