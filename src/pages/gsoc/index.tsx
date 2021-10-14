import Card from '@/components/Card';
import Date from '@/components/Date';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { getSortedContentMetadata } from '@/lib/content';
import { Post, PostAttributes } from '@/lib/models/content';
import Catalog from '@/components/Catalog';
import { InferGetStaticPropsType } from 'next';
import { useState, ChangeEvent } from 'react';
import Search from '@/components/Search';

export async function getStaticProps() {
  const allPostsData = getSortedContentMetadata<PostAttributes, Post>('gsoc');
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Posts({
  allPostsData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [search, setSearch] = useState('');

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) =>
    setSearch(event.target.value);

  const posts = allPostsData.filter((post) => {
    const {
      data: { title, description },
    } = post;
    const haystack = `${title} ${description}`;
    return haystack.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Layout
      customMeta={{
        title: 'Google Summer of Code',
        description:
          'The documentation of my Google Summer of Code 2019 journey with Django Software Foundation.',
      }}
    >
      <Card
        header={
          <h1 id="posts">
            <Link href="#gsoc-2019">GSoC 2019 Blog</Link>
          </h1>
        }
      >
        <p className="mb-8">
          In 2019, I participated in the{' '}
          <Link href="https://g.co/gsoc">Google Summer of Code (GSoC)</Link>{' '}
          program, during which I implemented the cross-DB{' '}
          <Link href="https://github.com/django/django/pull/12392">
            JSONField
          </Link>
          . This is the documentation of my journey.
        </p>
        <Search onSearch={handleSearch} />
      </Card>
      {posts.length ? (
        <Catalog
          className="my-4"
          border={false}
          items={posts.map((post) => (
            <div className="mb-2 last:mb-0" key={post.slug}>
              <Link
                href={`/gsoc/${post.slug}`}
                className="text-gray-700 dark:text-gray-300"
              >
                <Card className="py-4">
                  <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between mb-2">
                      <h2 className="text-xl font-semibold">
                        {post.data.title}
                      </h2>
                      <Date dateString={post.data.date} dateFormat="LLLL d" />
                    </div>
                    <div
                      className="markdown"
                      dangerouslySetInnerHTML={{
                        __html: post.data.description,
                      }}
                    />
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        />
      ) : (
        <div className="w-full text-center">
          <Card>No posts found matching your query.</Card>
        </div>
      )}
    </Layout>
  );
}
