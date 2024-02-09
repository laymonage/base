import Card from '@/components/Card';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { getSingleContentData } from '@/lib/content';
import { InferGetStaticPropsType } from 'next';

export async function getStaticProps() {
  const palates = await getSingleContentData('index', 'palates');
  palates.content = 'Test';
  return {
    props: {
      palates,
    },
  };
}

export default function Palates({
  palates,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      customMeta={{ title: 'Palates', description: `Palates of things.` }}
    >
      <Card
        header={
          <h2 id="palates">
            <Link href="#palates">{palates.data.title}</Link>
          </h2>
        }
      >
        <div className="markdown">
          <p>Test</p>
        </div>
      </Card>
    </Layout>
  );
}
