import Card from '@/components/Card';
import Duration from '@/components/Duration';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import SpotifyTracksTable from '@/components/SpotifyTracksTable';
import { humanizeMs } from '@/lib/datetime';
import { PlaylistFull } from '@/lib/models/spotify';
import { getSpotifyDataURL, simplifyPlaylistTrack } from '@/lib/spotify/data';
import { decodeHTML } from '@/lib/string';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { ExternalLink } from 'react-feather';

export async function getStaticPaths() {
  const data = await fetch(getSpotifyDataURL('playlists')).then((res) =>
    res.json(),
  );
  const allPlaylists = data.playlists as SpotifyApi.PlaylistObjectFull[];
  const paths = allPlaylists.map(({ id }) => ({ params: { id } }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const id = params?.id as string;

  const {
    name: title,
    description: originalDescription,
    images,
    external_urls,
    tracks: tracksFull,
  }: PlaylistFull = await fetch(getSpotifyDataURL(`playlists/${id}`)).then(
    (res) => res.json(),
  );

  const description =
    originalDescription || `The ${name} playlist on my Spotify account.`;
  const imageUrl = images[0]?.url;
  const spotifyUrl = external_urls.spotify;

  const tracks = tracksFull
    .filter(({ track }) => !!track)
    .map(simplifyPlaylistTrack);

  const duration =
    tracks.map((track) => track.duration_ms || 0).reduce((a, b) => a + b) || 0;
  return {
    props: { title, description, imageUrl, spotifyUrl, duration, tracks },
  };
}

export default function PlaylistTracks({
  title,
  description,
  imageUrl,
  spotifyUrl,
  duration,
  tracks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      customMeta={{
        title,
        description,
      }}
    >
      <div className="bleed min-h-screen w-full max-w-4xl place-self-center">
        <div className="my-4 mb-14 flex flex-wrap items-end gap-8 sm:flex-nowrap">
          <div className="flex h-48 w-48 flex-shrink-0 items-center justify-center">
            <img
              className="aspect-square h-full w-full object-cover"
              alt=""
              src={imageUrl}
            />
          </div>
          <Card header={title}>
            <p>{decodeHTML(description || '')}</p>
            <div className="flex items-center">
              <span>
                {tracks.length} songs,{' '}
                <Duration value={duration}>{humanizeMs(duration)}</Duration>
              </span>
              <span className="before:mx-2 before:content-['•']">
                <Link
                  className="inline-flex items-center gap-2"
                  href={spotifyUrl}
                >
                  Open on Spotify
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </span>
            </div>
          </Card>
        </div>
        <SpotifyTracksTable data={tracks} defaultSorting={[]} />
      </div>
    </Layout>
  );
}
