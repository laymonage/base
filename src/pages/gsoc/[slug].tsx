import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Card from '@/components/Card';
import Date from '@/components/Date';
import Layout from '@/components/Layout';
import { getAllContentSlugs, getSingleContentData } from '@/lib/content';
import { Post, PostAttributes } from '@/lib/models/content';
import MDXLayoutRenderer from '@/components/MDX';

export async function getStaticPaths() {
  const paths = getAllContentSlugs('gsoc');
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = params?.slug as string;
  const post = await getSingleContentData<PostAttributes, Post>(slug, 'gsoc');

  return {
    props: {
      post,
    },
  };
}

export default function SinglePost({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      customMeta={{
        title: post.data.title,
        description: post.data.description,
      }}
      hasComments={post.data.comments === true}
    >
      <Card>
        <div className="flex-row mt-4">
          <h2 className="mb-4 text-5xl font-semibold tracking-tight text-black dark:text-white">
            {post.data.title}
          </h2>
          <div className="flex justify-between mb-4">
            <Date dateString={post.data.date} />
            <span>{post.data.readingTime.text}</span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-4 mb-8 markdown">
          <MDXLayoutRenderer mdxSource={post.content as string} />
        </div>
      </Card>
    </Layout>
  );
}
