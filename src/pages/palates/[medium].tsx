import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Layout from '@/components/Layout';
import { getAllContentSlugs, getSingleContentData } from '@/lib/content';
import MDXLayoutRenderer from '@/components/MDX';
import Card from '@/components/Card';
import Link from '@/components/Link';

export async function getStaticPaths() {
  const paths = getAllContentSlugs('palates', 'medium').filter(
    // boom
    (v) => v.params.medium !== 'index',
  );
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const medium = params?.medium as string;
  const palate = await getSingleContentData(medium, 'palates');

  return {
    props: {
      medium,
      palate,
    },
  };
}

export default function PalateMedium({
  medium,
  palate,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      customMeta={{
        title: palate.data.title,
        description: palate.data.description,
      }}
    >
      <Card
        header={
          <h2 id={medium}>
            <Link href={`#${medium}`}>{palate.data.title}</Link>
          </h2>
        }
      >
        <div className="markdown">
          <MDXLayoutRenderer mdxSource={palate.content as string} />
        </div>
      </Card>
    </Layout>
  );
}
