import Card from '@/components/Card';
import Duration from '@/components/Duration';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import SpotifyTracksTable from '@/components/SpotifyTracksTable';
import { humanizeMs } from '@/lib/datetime';
import { useData } from '@/lib/hooks/data';
import { PlaylistFull } from '@/lib/models/spotify';
import { getSpotifyDataURL, simplifyPlaylistTrack } from '@/lib/spotify/data';
import { decodeHTML } from '@/lib/string';
import { useRouter } from 'next/router';
import { ExternalLink } from 'react-feather';

export default function PlaylistTracks() {
  const router = useRouter();
  const id = router.query.id as string;
  const [data, error] = useData<PlaylistFull>(
    id ? getSpotifyDataURL(`playlists/${id}`) : '',
  );

  const duration =
    data?.tracks
      .map((v) => v.track?.duration_ms || 0)
      .reduce((a, b) => a + b) || 0;

  return (
    <Layout
      customMeta={
        !data
          ? {
              title: 'Playlist',
              description: `A playlist on my Spotify account.`,
            }
          : {
              title: data.name,
              description:
                data.description ||
                `The ${data.name} playlist on my Spotify account.`,
            }
      }
    >
      <div className="bleed min-h-screen w-full max-w-4xl place-self-center">
        {error ? (
          <p>Unable to load the playlist</p>
        ) : !data ? (
          <div className="flex h-full min-h-screen flex-col items-center justify-center text-center">
            <img
              aria-hidden="true"
              className="mx-auto my-2"
              alt="Loading…"
              src="/img/equaliser-animated-green.gif"
            />
            Loading…
          </div>
        ) : (
          <>
            <div className="my-4 mb-14 flex flex-wrap items-end gap-8 sm:flex-nowrap">
              <div className="flex h-48 w-48 flex-shrink-0 items-center justify-center">
                <img
                  className="aspect-square h-full w-full object-cover"
                  alt=""
                  src={data.images[0]?.url}
                />
              </div>
              <Card header={data.name}>
                <p>{decodeHTML(data.description || '')}</p>
                <div className="flex items-center">
                  <span>
                    {data.tracks.length} songs,{' '}
                    <Duration value={duration}>{humanizeMs(duration)}</Duration>
                  </span>
                  <span className="before:mx-2 before:content-['•']">
                    <Link
                      className="inline-flex items-center gap-2"
                      href={data.external_urls.spotify}
                    >
                      Open on Spotify
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </span>
                </div>
              </Card>
            </div>
            <SpotifyTracksTable
              data={data.tracks
                .filter(({ track }) => !!track)
                .map(simplifyPlaylistTrack)}
              defaultSorting={[]}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
