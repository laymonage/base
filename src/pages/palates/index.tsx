import Card from '@/components/Card';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { InferGetStaticPropsType } from 'next';

export async function getStaticProps() {
  return {
    props: {
      test: 'Test hmm',
    },
  };
}

export default function Palates({
  test,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      customMeta={{ title: 'Palates', description: `Palates of things.` }}
    >
      <Card
        header={
          <h2 id="palates">
            <Link href="#palates">{test}</Link>
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
