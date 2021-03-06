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
        <div className="my-4">
          <h2 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
            {log.data.title}
          </h2>
          <p className="mt-2 text-xl">{humanizeLogSlug(log.slug)}</p>
        </div>
        <div
          className="max-w-2xl mx-auto my-4 markdown"
          dangerouslySetInnerHTML={{ __html: log.content || '' }}
        ></div>
      </Card>
    </Layout>
  );
};
export default SingleLog;
