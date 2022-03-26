import Image from 'next/image';
import Card from '@/components/Card';
import Date from '@/components/Date';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { getSortedContentMetadata } from '@/lib/content';
import { Post, PostAttributes } from '@/lib/models/content';
import Catalog from '@/components/Catalog';
import { InferGetStaticPropsType } from 'next';
import { ChangeEvent, useState } from 'react';
import Search from '@/components/Search';

export async function getStaticProps() {
  const allPostsData = getSortedContentMetadata<PostAttributes, Post>('posts');
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
  const showTags = false;

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) =>
    setSearch(event.target.value);

  const posts = allPostsData.filter((post) => {
    const {
      data: { title, tags, description },
    } = post;
    const haystack = `${title} ${tags.join(' ')} ${description}`;
    return haystack.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Layout
      customMeta={{ title: 'Posts', description: 'All posts by laymonage.' }}
    >
      <Card
        header={
          <h1 id="posts">
            <Link href="#posts">Posts</Link>
          </h1>
        }
      >
        <Search onSearch={handleSearch} />
      </Card>
      {posts.length ? (
        <Catalog
          className="my-8"
          border
          items={posts.map((post) => (
            <div className="mb-2 last:mb-0" key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="text-gray-700 dark:text-gray-300"
              >
                <Card>
                  <div className="flex flex-col sm:flex-row">
                    {post.data.image ? (
                      <div className="p-4 mb-6 mr-0 rounded dark:bg-gray-700 sm:w-48 sm:mb-0 sm:mr-8">
                        <div className="relative h-48 my-auto sm:h-full">
                          <Image
                            src={post.data.image}
                            alt={post.data.title}
                            title={post.data.title}
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      </div>
                    ) : null}
                    <div className="flex flex-col justify-between w-full sm:w-9/12">
                      <div>
                        <div className="flex flex-col justify-between mb-4">
                          <h2 className="text-xl font-semibold">
                            {post.data.title}
                          </h2>
                          <Date dateString={post.data.date} />
                        </div>
                        <p>{post.data.description}</p>
                      </div>
                      {showTags && post.data.tags.length ? (
                        <div className="flex">
                          {post.data.tags.map((tag) => (
                            <span
                              className="p-1 ml-2 bg-gray-400 border-2 border-gray-500 rounded first:ml-0 bg-opacity-20"
                              key={tag}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        />
      ) : (
        <Card className="my-8 text-center">
          No posts found matching your query.
        </Card>
      )}
    </Layout>
  );
}
