import { GetStaticPaths, GetStaticProps } from 'next';
import Card from '@/components/Card';
import Layout from '@/components/Layout';
import { getAllContentSlugs, getSingleContentData } from '@/lib/content';
import { Log, LogAttributes } from '@/lib/models/content';
import { humanizeLogSlug } from '@/lib/string';
import MDXLayoutRenderer from '@/components/MDX';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllContentSlugs('logs');
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const log = await getSingleContentData<LogAttributes, Log>(slug, 'logs');

  return {
    props: {
      log,
    },
  };
};

interface LogProps {
  log: Log;
}

export default function SingleLog({ log }: LogProps) {
  return (
    <Layout
      customMeta={{
        title: log.data.title,
        description: log.data.description,
      }}
      hasComments={log.data.comments === true}
    >
      <Card>
        <div className="my-4">
          <h2 className="mb-2 text-4xl font-semibold tracking-tight text-black dark:text-white">
            {log.data.title}
          </h2>
          <div className="flex justify-between mb-4">
            <span>{humanizeLogSlug(log.slug)}</span>
            <span>{log.data.readingTime.text}</span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto my-4 markdown">
          <MDXLayoutRenderer mdxSource={log.content as string} />
        </div>
      </Card>
    </Layout>
  );
}
