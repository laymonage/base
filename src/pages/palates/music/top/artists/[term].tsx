import Card from '@/components/Card';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import SpotifyArtistsTable from '@/components/SpotifyArtistsTable';
import { getSpotifyDataURL } from '@/lib/spotify/data';
import clsx from 'clsx';
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

const terms = ['short', 'medium', 'long'] as const;

export async function getStaticPaths() {
  const paths = terms.map((term) => ({ params: { term } }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const term = params?.term as (typeof terms)[number];

  const { artists }: { artists: SpotifyApi.ArtistObjectFull[] } = await fetch(
    getSpotifyDataURL(`top/artists/${term}_term`),
  ).then((res) => res.json());

  const tIdx = terms.indexOf(term);

  return {
    props: { artists, term, tIdx },
  };
}

export default function TopArtists({
  artists,
  term,
  tIdx,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      customMeta={{
        title: 'Top artists',
        description: `The top artists on my Spotify account.`,
      }}
    >
      <div className="bleed min-h-screen w-full max-w-4xl place-self-center">
        <div className="my-4 mb-8 flex flex-wrap items-end gap-8 sm:flex-nowrap">
          <Card header="Top artists">
            <p>
              These are my top artists on Spotify within a given time frame.{' '}
              <Link href="https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks">
                According to Spotify
              </Link>
              , "short term" means the last 4 weeks, "medium term" means the
              last 6 months, and "long term" means several years.
            </p>
          </Card>
        </div>
        <span className="sr-only">Choose a time frame:</span>
        <ol className="mb-4 flex w-fit items-center gap-x-1.5 rounded bg-blue-200 bg-opacity-25">
          {terms.map((t, i) => {
            return (
              <li
                className={clsx('relative rounded border-2 outline-offset-0', {
                  'before:pointer-events-none before:absolute before:inset-0 before:-left-px before:my-1 before:border-l before:border-gray-500':
                    t !== term && i !== 0 && i !== tIdx + 1,
                  'border-gray-500 border-opacity-25 bg-blue-800 bg-opacity-100 font-semibold text-white hover:text-white focus:text-white dark:bg-gray-800':
                    t === term,
                  'border-transparent': t !== term,
                })}
                key={t}
              >
                <Link
                  className="px-3 py-0.5 capitalize"
                  href={`/palates/music/top/artists/${t}`}
                  aria-current={t === term ? 'page' : undefined}
                >
                  {t}
                </Link>
              </li>
            );
          })}
        </ol>
        {<SpotifyArtistsTable data={artists} defaultSorting={[]} />}
      </div>
    </Layout>
  );
}
