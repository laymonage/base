import { useData } from '@/lib/hooks/data';
import { getSpotifyDataURL } from '@/lib/spotify/data';
import PlaylistTracks from './[id]';
import { TrackSimplified } from '@/lib/models/spotify';
import Link from '@/components/Link';
import SpotifyTracksTable from '@/components/SpotifyTracksTable';

const title = 'Liked Songs (Mirror)';
const description = `Shareable "Liked Songs" playlist synchronised by my spotify-to-github project.`;
const imageUrl =
  'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png';
const spotifyUrl = 'https://open.spotify.com/playlist/6T5QnaTXvu6ckKwcxANEwp';

export default function SavedTracks() {
  const [data, error] = useData<{ tracks: TrackSimplified[] }>(
    getSpotifyDataURL('tracks_simplified'),
  );

  const duration =
    data?.tracks?.map((v) => v.duration_ms || 0).reduce((a, b) => a + b) || 0;

  return (
    <PlaylistTracks
      title={title}
      description={description}
      richDescription={
        <p>
          Shareable "Liked Songs" playlist synchronised by my{' '}
          <Link href="https://github.com/laymonage/spotify-to-github">
            spotify-to-github
          </Link>{' '}
          project.
        </p>
      }
      imageUrl={imageUrl}
      spotifyUrl={spotifyUrl}
      duration={duration}
      tracks={data?.tracks || []}
    >
      {error ? (
        <p>Unable to load saved tracks.</p>
      ) : data ? (
        <SpotifyTracksTable data={data.tracks} />
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <img
            aria-hidden="true"
            className="mx-auto my-2"
            alt="Loading…"
            src="/img/equaliser-animated-green.gif"
          />
          Loading…
        </div>
      )}
    </PlaylistTracks>
  );
}
