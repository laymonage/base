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
import { useState } from 'react';

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
  const [summary, setSummary] = useState('More...');

  return (
    <Layout customMeta={{ title: 'About', description: `About laymonage.` }}>
      <Card
        className="mb-8"
        header={
          <h2 id="me">
            <Link href="#me">{about.data.title}</Link>
          </h2>
        }
      >
        <div className="markdown">
          <MDXLayoutRenderer mdxSource={about.content as string} />
        </div>
        <div className="mt-6 flex justify-end">
          <NowPlaying />
        </div>
      </Card>
      <Card
        className="mb-8"
        header={
          <h2 id="places">
            <Link href="#places">Places</Link>
          </h2>
        }
      >
        <p className="mb-4">
          We have a world full of wonders, and it has always been my dream to
          see as much of it as possible. Up until 2019, I've spent most of my
          life in Jakarta, Indonesia, with very few short trips to visit some
          friends and family, or to attend events. Circumstances didn't allow me
          to leave Java (the island).
        </p>
        <p className="mb-4">
          In 2019, I visited Malaysia to attend an event for three days. That
          was the very first time I left my home country. Not long after, the
          world went into a pandemic, so I didn't get to travel again.
        </p>
        <p className="mb-4">
          Then I moved to the UK in late 2022 as part of my job. Since then,
          I've had the opportunity to visit many other places the world has to
          offer. I thought it'd be interesting to see them on a map, so here it
          is!
        </p>
        <iframe
          className="w-full min-h-96 max-h-screen my-8"
          src="https://www.google.com/maps/d/embed?mid=1rWcLp6UVtUwmgJoHFWoMhll0lwFBV54&ehbc=2E312F&noprof=1"
        />
        <p className="mb-4">
          Despite living the better part of my life in Indonesia, the map shows
          you the sorry truth: I haven't had the chance to see much of my home
          country. There isn't even a marker on Bali.
        </p>
        <p className="mb-4">
          If you were to ask someone about places to visit in Indonesia, I'd
          probably be the last person you should ask. Let's hope this paragraph
          won't be here for long!
        </p>
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
        <details
          onToggle={(event) => {
            (event.target as HTMLDetailsElement).hasAttribute('open')
              ? setSummary('Less…')
              : setSummary('More…');
          }}
        >
          <summary className="alike my-4">
            <span className="ml-4">{summary}</span>
          </summary>
          <Catalog border items={rest} />
        </details>
      </Card>
    </Layout>
  );
}
