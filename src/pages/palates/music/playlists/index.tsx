import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { useData } from '@/lib/hooks/data';
import { getSpotifyDataURL } from '@/lib/spotify/data';

const isLikedSongs = (playlist: SpotifyApi.PlaylistObjectFull) =>
  playlist.name === 'Liked Songs (Mirror)';
const generated = (playlist: SpotifyApi.PlaylistObjectFull) =>
  playlist.name.includes('Top Songs') || isLikedSongs(playlist);
const created = (playlist: SpotifyApi.PlaylistObjectFull) =>
  playlist.owner.id === 'laymonage' && !generated(playlist);

export default function Playlists() {
  const [data] = useData<{ playlists: SpotifyApi.PlaylistObjectFull[] }>(
    getSpotifyDataURL('playlists'),
  );

  const playlists = {
    Generated: data?.playlists
      .filter(generated)
      .sort((a, b) =>
        isLikedSongs(a) ? -1 : +a.name.slice(-4) - +b.name.slice(-4),
      ),
    Created: data?.playlists.filter(created),
    Followed: data?.playlists.filter(
      (playlist) => !created(playlist) && !generated(playlist),
    ),
  };

  return (
    <Layout
      customMeta={{
        title: 'Playlists',
        description: `Here are all the playlists on my Spotify account.`,
      }}
    >
      <div className="bleed flex min-h-screen w-full max-w-4xl flex-col gap-8 place-self-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Playlists</h1>
          <p>Here are all the playlists on my Spotify account.</p>
        </div>
        {Object.entries(playlists).map(
          ([type, group]) =>
            group && (
              <div className="flex flex-col gap-2" key={type}>
                <h2 className="text-2xl font-bold">{type}</h2>
                <ul className="grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 sm:grid-cols-3 sm:gap-6 md:grid-cols-4">
                  {group?.map((playlist) => {
                    const isLiked = isLikedSongs(playlist);
                    const url = isLiked
                      ? '/palates/music/saved-tracks'
                      : `/palates/music/playlists/tracks?id=${playlist.id}`;
                    const img = isLiked
                      ? 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png'
                      : playlist.images[0]?.url;
                    return (
                      <li key={playlist.id}>
                        <Link
                          className="flex flex-col gap-2 rounded-lg p-4 hover:bg-blue-300 hover:bg-opacity-10"
                          href={url}
                        >
                          <img
                            alt=""
                            src={img}
                            className="aspect-square h-full w-full rounded object-cover"
                          />
                          <div className="overflow-clip text-ellipsis whitespace-nowrap font-semibold">
                            {playlist.name}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ),
        )}
      </div>
    </Layout>
  );
}
