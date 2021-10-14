import Contact, { data } from '@/components/Contact';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout customMeta={{ description: data.metaDescription }}>
      <Contact {...data} />
    </Layout>
  );
}
