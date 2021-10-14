import Card from '@/components/Card';
import Catalog from '@/components/Catalog';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { getGroupedLogsMetadata } from '@/lib/content';
import { InferGetStaticPropsType } from 'next';
import { Fragment } from 'react';

export async function getStaticProps() {
  const allLogsData = getGroupedLogsMetadata();
  return {
    props: {
      allLogsData,
    },
  };
}

export default function Logs({
  allLogsData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      customMeta={{ title: 'Logs', description: 'All logs by laymonage.' }}
    >
      <Card
        className="mb-8"
        header={
          <h1 id="logs">
            <Link href="#logs">Logs</Link>
          </h1>
        }
      >
        <p>
          These are logs that contain my life updates. If things are not moving
          too fast, a new log is up every Sunday. Some of these may be shorter
          than a paragraph, and some may be a few articles worth of words. Some
          may make sense, some may not. Some may be useful, some may make you
          wonder why {`you're `} reading these. Make of them what you will.
        </p>
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
                  <Link
                    href={`/logs/${log.slug}`}
                    key={log.slug}
                    className="block mt-4 text-gray-700 dark:text-gray-300"
                  >
                    <h3>Week {log.data.week}</h3>
                    <h2 className="text-xl font-semibold">{log.data.title}</h2>
                  </Link>
                ))}
              />
            </Fragment>
          ))
        ) : (
          <p>No logs so far.</p>
        )}
      </Card>
    </Layout>
  );
}
