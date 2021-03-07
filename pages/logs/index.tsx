import Link from 'next/link';
import Card from 'components/Card';
import Layout from 'components/Layout';
import { getSortedLogsData } from 'lib/content';
import { Log } from 'lib/models/content';
import { GetStaticProps } from 'next';
import Catalog from 'components/Catalog';
import { humanizeLogSlug } from 'lib/string';

interface LogsData {
  allLogsData: Log[];
}

export const getStaticProps: GetStaticProps = async () => {
  const allLogsData = getSortedLogsData();
  return {
    props: {
      allLogsData,
    },
  };
};

const Logs = ({ allLogsData }: LogsData) => {
  return (
    <Layout customMeta={{ title: 'Logs', description: 'All logs by laymonage.' }}>
      <div className="w-full mb-2">
        <Card
          header={
            <h1 id="logs">
              <Link href="#logs">
                <a>Logs</a>
              </Link>
            </h1>
          }
        >
          {allLogsData.length > 0 ? (
            <Catalog
              border={false}
              className="ml-5 list-disc"
              items={allLogsData.map((log) => (
                <Link href={`/logs/${log.slug}`} key={log.slug}>
                  <a className="block mt-4 text-gray-700 dark:text-gray-300">
                    <h3>{humanizeLogSlug(log.slug)}</h3>
                    <h2 className="text-xl font-bold">{log.data.title}</h2>
                  </a>
                </Link>
              ))}
            />
          ) : (
            <p>No logs so far.</p>
          )}
        </Card>
      </div>
    </Layout>
  );
};
export default Logs;
