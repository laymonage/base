import Card from '@/components/Card';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import SpotifyTracksTable from '@/components/SpotifyTracksTable';
import { useData } from '@/lib/hooks/data';
import { ComponentProps } from 'react';
import { Heart } from 'react-feather';

const SPOTIFY_SAVED_TRACKS_RAW_URL =
  'https://raw.githubusercontent.com/laymonage/spotify-to-github';
const SPOTIFY_SAVED_TRACKS_DATA_URL = `${SPOTIFY_SAVED_TRACKS_RAW_URL}/data/data`;
const SPOTIFY_SAVED_TRACKS_DATA_FILE = 'tracks_simplified.json';

type SpotifySavedTracksData = ComponentProps<typeof SpotifyTracksTable>['data'];

export default function Selections() {
  const [data, error] = useData<{ tracks: SpotifySavedTracksData }>(
    `${SPOTIFY_SAVED_TRACKS_DATA_URL}/${SPOTIFY_SAVED_TRACKS_DATA_FILE}`,
  );

  return (
    <Layout
      customMeta={{ title: 'Selections', description: `Selections of things.` }}
    >
      <div className="bleed w-full max-w-4xl place-self-center">
        <div className="my-4 mb-14 flex flex-wrap items-end gap-8 sm:flex-nowrap">
          <div className="flex h-48 w-48 flex-shrink-0 items-center justify-center bg-blue-200 bg-opacity-50">
            <Heart fill="currentColor" className="h-20 w-20" />
          </div>
          <Card header="Saved tracks">
            <p>
              For science, I've made an{' '}
              <Link href="https://github.com/laymonage/spotify-to-github">
                automated scraper
              </Link>{' '}
              that exports my Spotify saved tracks every day. It allows me to
              share the playlist here, without having to make a Spotify API call
              every time someone visits this page.
            </p>
          </Card>
        </div>
        {!error ? (
          <SpotifyTracksTable data={data?.tracks} />
        ) : (
          <p>Unable to load saved tracks.</p>
        )}
      </div>
    </Layout>
  );
}
