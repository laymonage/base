import Card from '@/components/Card';
import Duration from '@/components/Duration';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import SpotifyTracksTable from '@/components/SpotifyTracksTable';
import { humanizeMs } from '@/lib/datetime';
import { useData } from '@/lib/hooks/data';
import { getSpotifyDataURL } from '@/lib/spotify/data';
import { ComponentProps } from 'react';
import { ExternalLink } from 'react-feather';

type SpotifySavedTracksData = ComponentProps<typeof SpotifyTracksTable>['data'];

export default function Selections() {
  const [data, error] = useData<{ tracks: SpotifySavedTracksData }>(
    getSpotifyDataURL('tracks_simplified'),
  );

  const duration =
    data?.tracks?.map((v) => v.duration_ms || 0).reduce((a, b) => a + b) || 0;

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
              Shareable "Liked Songs" playlist synchronised by my{' '}
              <Link href="https://github.com/laymonage/spotify-to-github">
                spotify-to-github
              </Link>{' '}
              project.
            </p>
            <div className="flex items-center">
              <span>
                {data?.tracks?.length} songs,{' '}
                <Duration value={duration}>{humanizeMs(duration)}</Duration>
              </span>
              <span className="before:mx-2 before:content-['•']">
                <Link
                  className="inline-flex items-center gap-2"
                  href="https://open.spotify.com/playlist/6T5QnaTXvu6ckKwcxANEwp"
                >
                  Open on Spotify
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </span>
            </div>
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
