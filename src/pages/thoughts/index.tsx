import Card from '@/components/Card';
import Catalog from '@/components/Catalog';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { getSortedContentMetadata } from '@/lib/content';
import { PostAttributes, Post } from '@/lib/models/content';
import { InferGetStaticPropsType } from 'next';

export async function getStaticProps() {
  const allThoughtsData = getSortedContentMetadata<PostAttributes, Post>(
    'thoughts',
  );
  return {
    props: {
      allThoughtsData,
    },
  };
}

export default function Thoughts({
  allThoughtsData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      customMeta={{
        title: 'Thoughts',
        description: 'All thoughts by laymonage.',
      }}
    >
      <Card
        className="mb-8"
        header={
          <h1 id="thoughts">
            <Link href="#thoughts">Thoughts</Link>
          </h1>
        }
      >
        <p>A collection of irregularly published thoughts.</p>
        {allThoughtsData.length > 0 ? (
          <Catalog
            border={false}
            className="ml-5 list-disc"
            items={allThoughtsData.map((thought) => (
              <Link
                href={`/thoughts/${thought.slug}`}
                key={thought.slug}
                className="mt-4 block text-gray-700 dark:text-gray-300"
              >
                <h2 className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xl">
                  <time
                    className="font-semibold tabular-nums"
                    dateTime={thought.data.date}
                  >
                    {thought.data.date}
                  </time>
                  <span className="sr-only">-</span>
                  {thought.data.title}
                </h2>
              </Link>
            ))}
          />
        ) : (
          <p>No thoughts so far.</p>
        )}
      </Card>
    </Layout>
  );
}
