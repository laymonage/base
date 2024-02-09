import Card from '@/components/Card';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { getSingleContentData } from '@/lib/content';
import { InferGetStaticPropsType } from 'next';

export async function getStaticProps() {
  const palates = await getSingleContentData('index', 'palates');
  delete palates.content;
  // @ts-expect-error test
  delete palates.data;
  // @ts-expect-error test 2
  delete palates.slug;
  console.log({ palates });
  return {
    props: {
      test: 'Test hmm',
      palates: palates,
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
        <p>Please</p>
        <div className="markdown">
          <p>Test</p>
        </div>
        <p>New</p>
        <p>Also new</p>
        <p>Another one</p>
        <p>Again?</p>
        <p>Giving up</p>
      </Card>
    </Layout>
  );
}
