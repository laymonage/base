import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Layout from '@/components/Layout';
import { getAllContentSlugs, getSingleContentData } from '@/lib/content';
import { Log, LogAttributes } from '@/lib/models/content';
import { humanizeLogSlug } from '@/lib/string';
import MDXLayoutRenderer from '@/components/MDX';

export async function getStaticPaths() {
  const paths = getAllContentSlugs('logs');
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = params?.slug as string;
  const log = await getSingleContentData<LogAttributes, Log>(slug, 'logs');

  return {
    props: {
      log,
      slug,
    },
  };
}

export default function SingleLog({
  log,
  slug,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      customMeta={{
        title: log.data.title,
        description: log.data.description,
      }}
      hasComments={log.data.comments === true}
    >
      <div className="my-4">
        <h2 className="mb-2 text-4xl font-semibold tracking-tight text-black dark:text-white">
          {log.data.title}
        </h2>
        <div className="mb-4 flex justify-between">
          <span>{humanizeLogSlug(log.slug)}</span>
          <span>{log.data.readingTime.text}</span>
        </div>
      </div>
      <div key={slug} className="markdown mx-auto my-4">
        <MDXLayoutRenderer mdxSource={log.content as string} />
      </div>
    </Layout>
  );
}
