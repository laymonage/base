import Card from '@/components/Card';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import SpotifyTracksTable from '@/components/SpotifyTracksTable';
import { useData } from '@/lib/hooks/data';
import { getSpotifyDataURL } from '@/lib/spotify/data';
import { ComponentProps } from 'react';

type SpotifySavedTracksData = ComponentProps<typeof SpotifyTracksTable>['data'];

export default function Selections() {
  const [data, error] = useData<{ tracks: SpotifySavedTracksData }>(
    getSpotifyDataURL('tracks_simplified'),
  );

  return (
    <Layout
      customMeta={{ title: 'Selections', description: `Selections of things.` }}
    >
      <div className="bleed w-full max-w-4xl place-self-center">
        <div className="my-4 mb-14 flex flex-wrap items-end gap-8 sm:flex-nowrap">
          <div className="flex h-48 w-48 flex-shrink-0 items-center justify-center bg-blue-200 bg-opacity-50">
            <img
              alt=""
              src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
            />
          </div>
          <Card header="Saved tracks">
            <p>
              For science, I've made an{' '}
              <Link href="https://github.com/laymonage/spotify-to-github">
                automated scraper
              </Link>{' '}
              that exports my Spotify saved tracks every day. It allows me to
              share the playlist here, without having to make a Spotify API call
              every time someone visits this page. You can also{' '}
              <Link href="https://open.spotify.com/playlist/6T5QnaTXvu6ckKwcxANEwp">
                follow the playlist on Spotify
              </Link>
              .
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
