import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import Card from '../../components/Card';
import Date from '../../components/Date';
import Layout from '../../components/Layout';
import { getSortedPostsData } from '../../lib/content';
import { postPropTypes } from '../../lib/models/content';

const propTypes = {
  allPostsData: PropTypes.arrayOf(PropTypes.shape(postPropTypes)),
};
type PostsData = PropTypes.InferProps<typeof propTypes>;

export async function getStaticProps(): Promise<{ props: PostsData }> {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

const Posts: React.FC<PostsData> = ({ allPostsData }) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const posts = allPostsData.filter((post) => {
    const {
      data: { title, tags, description },
    } = post;
    const haystack = `${title} ${tags.join(' ')} ${description}`;
    return haystack.toLowerCase().includes(search.toLowerCase());
  });

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === '/' && document.activeElement !== inputRef.current) {
      event.preventDefault();
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  return (
    <div className="w-full mx-auto mt-2 mb-16 sm:mt-32">
      <Layout>
        <div className="w-full mx-auto md:w-11/12 lg:w-9/12 xl:w-7/12">
          <div className="mb-2">
            <Card>
              <h1 className="mb-8 text-4xl text-center">Posts</h1>
              <div className="flex">
                <input
                  className="flex-grow w-full px-4 py-2 bg-gray-300 border-2 border-gray-400 rounded sm:border-r-0 sm:rounded-r-none border-opacity-20 focus:outline-none focus:bg-opacity-30 hover:bg-opacity-30 bg-opacity-10"
                  placeholder="Type what you're looking for..."
                  type="text"
                  onChange={(event) => setSearch(event.target.value)}
                  ref={inputRef}
                />
                <kbd
                  className="hidden h-full p-2 my-auto text-gray-400 bg-gray-400 border-2 border-gray-400 rounded rounded-l-none border-opacity-20 bg-opacity-20 sm:block"
                  title="Press / to focus"
                >
                  /
                </kbd>
              </div>
            </Card>
          </div>
          {(posts.length &&
            posts.map((post) => (
              <div className="mb-2" key={post.slug}>
                <Link href={`/posts/${post.slug}`}>
                  <a className="text-gray-700 dark:text-gray-300">
                    <Card>
                      <div className="flex flex-col sm:flex-row">
                        {
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
                        }
                        <div className="flex flex-col justify-between w-full sm:w-9/12">
                          <div>
                            <div className="flex flex-col justify-between mb-4">
                              <h2 className="text-xl font-bold">{post.data.title}</h2>
                              <Date dateString={post.data.date} />
                            </div>
                            <div className="mb-6">{post.data.description}</div>
                          </div>
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
                        </div>
                      </div>
                    </Card>
                  </a>
                </Link>
              </div>
            ))) || (
            <div className="text-center">
              <Card>No posts found matching your query.</Card>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};
Posts.propTypes = propTypes;
export default Posts;
