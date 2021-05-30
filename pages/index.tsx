import Contact, { data } from 'components/Contact';
import Layout from 'components/Layout';

const Home = () => {
  return (
    <Layout navSafe customMeta={{ description: data.metaDescription }}>
      <div className="flex items-center w-full min-h-screen">
        <Contact {...data} />
      </div>
    </Layout>
  );
};
export default Home;
