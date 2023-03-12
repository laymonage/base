import Card from '@/components/Card';
import Catalog from '@/components/Catalog';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { getGroupedLogsMetadata } from '@/lib/content';
import { InferGetStaticPropsType } from 'next';

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
          These were logs that contain my life updates between 2021 and 2022. If
          things were not moving too fast, a new log would be up every Monday.
          Some of these might be shorter than a paragraph, and some might be a
          few articles worth of words. Some might make sense, some might not.
          Some might be useful, some might make you wonder why {`you're `}
          reading these. Make of them what you will.
        </p>
        {allLogsData.length > 0 ? (
          allLogsData.map(([year, logs], index) => (
            <details key={year} open={index === 0}>
              <summary className="mt-6 text-2xl font-semibold text-gray-800 marker:text-xl dark:text-gray-100">
                <h2 className="ml-2 align-text-top">{year}</h2>
              </summary>
              <Catalog
                key={year}
                border={false}
                className="ml-5 list-disc"
                items={logs.map((log) => (
                  <Link
                    href={`/logs/${log.slug}`}
                    key={log.slug}
                    className="mt-4 block text-gray-700 dark:text-gray-300"
                  >
                    <h3>Week {log.data.week}</h3>
                    <h2 className="text-xl font-semibold">{log.data.title}</h2>
                  </Link>
                ))}
              />
            </details>
          ))
        ) : (
          <p>No logs so far.</p>
        )}
      </Card>
    </Layout>
  );
}
