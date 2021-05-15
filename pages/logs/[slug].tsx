import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Card from 'components/Card';
import Layout from 'components/Layout';
import { getAllLogSlugs, getLogData } from 'lib/content';
import { Log } from 'lib/models/content';
import { humanizeLogSlug } from 'lib/string';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllLogSlugs();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const log = await getLogData(params.slug as string);
  return {
    props: {
      log,
    },
  };
};

interface LogProps {
  log: Log;
}

const SingleLog = ({ log }: LogProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Layout
      customMeta={{
        title: log.data.title,
        description: log.data.description,
      }}
    >
      <Card>
        <div className="mt-4 mb-12 text-center">
          <p className="text-xl">{humanizeLogSlug(log.slug)}</p>
          <h2 className="mt-2 text-3xl font-bold">{log.data.title}</h2>
        </div>
        <div
          className="mx-auto my-4 markdown max-w-prose"
          dangerouslySetInnerHTML={{ __html: log.content }}
        ></div>
      </Card>
      {mounted && log.data.comments === true ? (
        <>
          <div className="my-4" />

          <Card>
            <div className="w-full giscussions" />
          </Card>

          <Head>
            <script
              src="https://giscussions.vercel.app/client.js"
              data-repo="laymonage/base"
              data-repo-id="MDEwOlJlcG9zaXRvcnkzNDExNDE2OTY="
              data-category-id="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyNzIzMDI4"
              data-mapping="pathname"
              data-theme={theme === 'light' ? 'light' : 'dark_dimmed'}
              crossOrigin="anonymous"
              async
            />
          </Head>
        </>
      ) : null}
    </Layout>
  );
};
export default SingleLog;
