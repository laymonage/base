import { GetStaticProps } from 'next';
import Link from 'next/link';
import Card from '@/components/Card';
import Catalog from '@/components/Catalog';
import Layout from '@/components/Layout';
import { timelineData } from '@/data/about';
import { getContentData } from '@/lib/content';
import { YearData } from '@/lib/models/about';
import { Post } from '@/lib/models/content';
import NowPlaying from '@/components/NowPlaying';

export const getStaticProps: GetStaticProps = async () => {
  const about = await getContentData('about');
  return {
    props: {
      about,
    },
  };
};

interface AboutProps {
  about: Post;
}

function TimelineYear({ data }: { data: YearData }) {
  return (
    <>
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{data.year}</h3>
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

const dataToTimeline = (data: YearData) => <TimelineYear data={data} key={data.year} />;

export default function About({ about }: AboutProps) {
  const [one, two, three, ...rest] = timelineData;
  const latestItems = [one, two, three].map(dataToTimeline);

  return (
    <Layout customMeta={{ title: 'About', description: `About laymonage.` }}>
      <Card
        header={
          <h2 id="me">
            <Link href="#me">
              <a className="">{about.data.title}</a>
            </Link>
          </h2>
        }
      >
        <div className="markdown" dangerouslySetInnerHTML={{ __html: about.content || '' }}></div>
        <div className="flex justify-end my-6">
          <NowPlaying />
        </div>
      </Card>
      <Card
        header={
          <h2 id="timeline">
            <Link href="#timeline">
              <a>Timeline</a>
            </Link>
          </h2>
        }
      >
        <Catalog border items={latestItems} />
        <details>
          <summary className="my-4 cursor-pointer alike">More...</summary>
          <Catalog border items={rest.map(dataToTimeline)} />
        </details>
      </Card>
    </Layout>
  );
}
