import Card from '@/components/Card';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import MDXLayoutRenderer from '@/components/MDX';
import { getSingleContentData } from '@/lib/content';
import { InferGetStaticPropsType } from 'next';

export async function getStaticProps() {
  const palates = await getSingleContentData('palates');
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
          <MDXLayoutRenderer mdxSource={palates.content as string} />
        </div>
      </Card>
    </Layout>
  );
}
