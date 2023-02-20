import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Card from '@/components/Card';
import Layout from '@/components/Layout';
import { getAllContentSlugs, getSingleContentData } from '@/lib/content';
import { Post, PostAttributes } from '@/lib/models/content';
import MDXLayoutRenderer from '@/components/MDX';

export async function getStaticPaths() {
  const paths = getAllContentSlugs('thoughts', 'date');
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const date = params?.date as string;
  const thought = await getSingleContentData<PostAttributes, Post>(
    date,
    'thoughts',
  );

  return {
    props: {
      thought,
      date,
    },
  };
}

export default function SingleThought({
  thought,
  date,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      customMeta={{
        title: thought.data.title,
        description: thought.data.description,
      }}
      hasComments={thought.data.comments === true}
    >
      <Card>
        <div className="my-4">
          <h2 className="mb-2 text-4xl font-semibold tracking-tight text-black dark:text-white">
            {thought.data.title}
          </h2>
          <div className="flex justify-between mb-4">
            <span>{thought.slug}</span>
            <span>{thought.data.readingTime.text}</span>
          </div>
        </div>
        <div key={date} className="max-w-2xl mx-auto my-4 markdown">
          <MDXLayoutRenderer mdxSource={thought.content as string} />
        </div>
      </Card>
    </Layout>
  );
}
