import Contact, { data } from '@/components/Contact';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout navSafe customMeta={{ description: data.metaDescription }}>
      <div className="flex items-center w-full min-h-screen">
        <Contact {...data} />
      </div>
    </Layout>
  );
}
