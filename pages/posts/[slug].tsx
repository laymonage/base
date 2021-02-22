import { GetStaticPaths, GetStaticProps } from 'next';
import Card from '../../components/Card';
import Date from '../../components/Date';
import Layout from '../../components/Layout';
import { getAllPostSlugs, getPostData } from '../../lib/content';
import { Post } from '../../lib/models/content';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostData(params.slug as string);
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
  return (
    <div className="w-full mx-auto mt-2 mb-16 sm:mt-32">
      <Layout title={post.data.title}>
        <div className="mx-auto mt-16 mb-2 first:mt-0 post">
          <Card>
            <div className="flex-row text-center">
              <h2 className="mb-4 text-3xl font-bold">{post.data.title}</h2>
              <Date className="block mb-4" dateString={post.data.date} />
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
            </div>
            <div
              className="mt-4 sm:mx-4 markdown max-w-prose"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </Card>
        </div>
      </Layout>
    </div>
  );
};
export default SinglePost;
