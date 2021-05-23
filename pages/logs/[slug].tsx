import { GetStaticPaths, GetStaticProps } from 'next';
import Card from 'components/Card';
import Layout from 'components/Layout';
import { getAllLogSlugs, getLogData } from 'lib/content';
import { Log } from 'lib/models/content';
import { humanizeLogSlug } from 'lib/string';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllLogSlugs();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const log = await getLogData(params?.slug as string);
  return {
    props: {
      log,
    },
  };
};

interface LogProps {
  log: Log;
}

const SingleLog = ({ log }: LogProps) => {
  return (
    <Layout
      customMeta={{
        title: log.data.title,
        description: log.data.description,
      }}
      hasComments={log.data.comments === true}
    >
      <Card>
        <div className="mt-4 mb-12 text-center">
          <p className="text-xl">{humanizeLogSlug(log.slug)}</p>
          <h2 className="mt-2 text-3xl font-bold">{log.data.title}</h2>
        </div>
        <div
          className="mx-auto my-4 markdown max-w-prose"
          dangerouslySetInnerHTML={{ __html: log.content || '' }}
        ></div>
      </Card>
    </Layout>
  );
};
export default SingleLog;
