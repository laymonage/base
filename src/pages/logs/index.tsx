import Link from 'next/link';
import Card from '@/components/Card';
import Catalog from '@/components/Catalog';
import Layout from '@/components/Layout';
import { getGroupedLogsData } from '@/lib/content';
import { GetStaticProps } from 'next';
import { Fragment } from 'react';

interface LogsData {
  allLogsData: ReturnType<typeof getGroupedLogsData>;
}

export const getStaticProps: GetStaticProps = async () => {
  const allLogsData = getGroupedLogsData();
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
            allLogsData.map(([year, logs]) => (
              <Fragment key={year}>
                <h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  {year}
                </h2>
                <Catalog
                  key={year}
                  border={false}
                  className="ml-5 list-disc"
                  items={logs.map((log) => (
                    <Link href={`/logs/${log.slug}`} key={log.slug}>
                      <a className="block mt-4 text-gray-700 dark:text-gray-300">
                        <h3>Week {log.data.week}</h3>
                        <h2 className="text-xl font-semibold">{log.data.title}</h2>
                      </a>
                    </Link>
                  ))}
                />
              </Fragment>
            ))
          ) : (
            <p>No logs so far.</p>
          )}
        </Card>
      </div>
    </Layout>
  );
};
export default Logs;
