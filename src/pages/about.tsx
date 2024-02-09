import Card from '@/components/Card';
import Catalog from '@/components/Catalog';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { timelineData } from '@/data/about';
import { getSingleContentData } from '@/lib/content';
import { YearData } from '@/lib/models/about';
import NowPlaying from '@/components/NowPlaying';
import MDXLayoutRenderer from '@/components/MDX';
import { InferGetStaticPropsType } from 'next';

export async function getStaticProps() {
  const about = await getSingleContentData('about');
  return {
    props: {
      about,
    },
  };
}

function TimelineYear({ data }: { data: YearData }) {
  return (
    <>
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        {data.year}
      </h3>
      <ul>
        {data.items.map((item) => (
          <li key={item.title} className="mt-4">
            <p className="flex font-semibold text-gray-800 dark:text-gray-100">
              <span className="w-8">{item.emoji}</span>
              <span>{item.title}</span>
            </p>
            <p className="ml-8">{item.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

const dataToTimeline = (data: YearData) => (
  <TimelineYear data={data} key={data.year} />
);

export default function About({
  about,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const latestItems = timelineData.slice(0, 6).map(dataToTimeline);
  const rest = timelineData.slice(6).map(dataToTimeline);

  return (
    <Layout customMeta={{ title: 'About', description: `About laymonage.` }}>
      <Card
        header={
          <h2 id="me">
            <Link href="#me">{about.data.title}</Link>
          </h2>
        }
      >
        <div className="markdown">
          <MDXLayoutRenderer mdxSource={about.content as string} />
        </div>
        <div className="my-6 flex justify-end">
          <NowPlaying />
        </div>
      </Card>
      <Card
        className="mb-8"
        header={
          <h2 id="timeline">
            <Link href="#timeline">Timeline</Link>
          </h2>
        }
      >
        <Catalog border items={latestItems} />
        <details>
          <summary className="alike my-4">
            <span className="ml-2">More...</span>
          </summary>
          <Catalog border items={rest} />
        </details>
      </Card>
    </Layout>
  );
}
