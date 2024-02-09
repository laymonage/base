import Card from '@/components/Card';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { InferGetStaticPropsType } from 'next';

export async function getStaticProps() {
  console.log({ palates: 'naon' });
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
        <p>Please</p>
        <div className="markdown">
          <p>Test</p>
        </div>
        <p>New</p>
        <p>Also new</p>
        <p>Another one</p>
        <p>Again?</p>
        <p>Giving up</p>
        <p>I don't understand</p>
      </Card>
    </Layout>
  );
}
