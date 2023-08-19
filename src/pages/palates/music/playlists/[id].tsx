import Card from '@/components/Card';
import Duration from '@/components/Duration';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import SpotifyTracksTable from '@/components/SpotifyTracksTable';
import Spotify from '@/components/icons/Spotify.svg';
import { humanizeMs } from '@/lib/datetime';
import { PlaylistFull } from '@/lib/models/spotify';
import { getSpotifyDataURL, simplifyPlaylistTrack } from '@/lib/spotify/data';
import { decodeHTML } from '@/lib/string';
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import type { ReactNode } from 'react';

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
    description,
    images,
    external_urls,
    tracks: tracksFull,
  }: PlaylistFull = await fetch(getSpotifyDataURL(`playlists/${id}`)).then(
    (res) => res.json(),
  );

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

interface PlaylistTracksProps
  extends InferGetStaticPropsType<typeof getStaticProps> {
  richDescription?: ReactNode;
  children?: ReactNode;
}

export default function PlaylistTracks({
  title,
  description,
  richDescription,
  imageUrl,
  spotifyUrl,
  duration,
  tracks,
  children,
}: PlaylistTracksProps) {
  return (
    <Layout
      customMeta={{
        title,
        description:
          description || `The ${title} playlist on my Spotify account.`,
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
            {richDescription ||
              (description ? <p>{decodeHTML(description || '')}</p> : null)}
            <div className="mt-1 flex flex-wrap items-center gap-x-1.5">
              <span>
                <Link className="flex items-center gap-2" href={spotifyUrl}>
                  <Spotify className="h-5 w-5 fill-black dark:fill-white" />
                  Open on Spotify
                </Link>
              </span>
              <span className="before:ml-2 before:mr-4 before:content-['•']">
                {tracks ? tracks.length : 'Loading'} songs,{' '}
                <Duration value={duration}>{humanizeMs(duration)}</Duration>
              </span>
            </div>
          </Card>
        </div>
        {children || <SpotifyTracksTable data={tracks} defaultSorting={[]} />}
      </div>
    </Layout>
  );
}
