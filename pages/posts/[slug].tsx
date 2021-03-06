import { GetStaticPaths, GetStaticProps } from 'next';
import Card from 'components/Card';
import Date from 'components/Date';
import Layout from 'components/Layout';
import { getAllPostSlugs, getPostData } from 'lib/content';
import { Post } from 'lib/models/content';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostData(params?.slug as string);
  return {
    props: {
      post,
    },
  };
};

interface PostProps {
  post: Post;
}

const SinglePost = ({ post }: PostProps) => {
  const showTags = false;
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
          <Date className="block mb-4" dateString={post.data.date} />
          {showTags ? (
            <div className="mb-16">
              {post.data.tags.map((tag) => (
                <span
                  className="p-1 mx-1 bg-gray-400 border-2 border-gray-500 rounded bg-opacity-20"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div
          className="max-w-2xl mx-auto mt-4 mb-8 markdown"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        ></div>
      </Card>
    </Layout>
  );
};
export default SinglePost;
