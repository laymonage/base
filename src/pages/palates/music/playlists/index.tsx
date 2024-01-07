import Layout from '@/components/Layout';
import Link from '@/components/Link';
import { getSpotifyDataURL } from '@/lib/spotify/data';
import { InferGetStaticPropsType } from 'next';

const isLikedSongs = (playlist: SpotifyApi.PlaylistObjectFull) =>
  playlist.name === 'Liked Songs (Mirror)';
const generated = (playlist: SpotifyApi.PlaylistObjectFull) =>
  playlist.name.includes('Top Songs') ||
  playlist.name.includes('Daily Mix') ||
  playlist.name === 'Discover Weekly' ||
  playlist.name === 'Release Radar' ||
  playlist.name === 'Tastebreakers' ||
  isLikedSongs(playlist);
const created = (playlist: SpotifyApi.PlaylistObjectFull) =>
  playlist.owner.id === 'laymonage' && !generated(playlist);

export async function getStaticProps() {
  const data = await fetch(getSpotifyDataURL('playlists')).then((res) =>
    res.json(),
  );
  const allPlaylists = data.playlists as SpotifyApi.PlaylistObjectFull[];
  const groups = [
    {
      group: 'Tailored',
      playlists: allPlaylists
        .filter(generated)
        .sort((a, b) => {
          if (isLikedSongs(a)) return -1;
          if (isLikedSongs(b)) return 1;

          const aSplit = a.name.split(' ');
          const aNumber = +aSplit[aSplit.length - 1];
          const bSplit = b.name.split(' ');
          const bNumber = +bSplit[bSplit.length - 1];

          if (!aNumber && !bNumber)
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
          if (!aNumber && bNumber) return -1;
          if (aNumber && !bNumber) return 1;

          return aNumber - bNumber;
        })
        .map((playlist) => {
          if (isLikedSongs(playlist)) {
            playlist.id = 'saved-tracks';
          }
          return playlist;
        }),
    },
    { group: 'Created', playlists: allPlaylists.filter(created) },
    {
      group: 'Followed',
      playlists: allPlaylists.filter(
        (playlist) => !created(playlist) && !generated(playlist),
      ),
    },
  ];
  return {
    props: { groups },
  };
}

export default function Playlists({
  groups,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
        {groups.map(({ group, playlists }) => (
          <div className="flex flex-col gap-2" key={group}>
            <h2 className="text-2xl font-bold">{group}</h2>
            <ul className="grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 sm:grid-cols-3 sm:gap-6 md:grid-cols-4">
              {playlists.map(({ id, images, name }) => (
                <li key={id}>
                  <Link
                    className="flex flex-col gap-2 rounded-lg p-4 hover:bg-blue-300 hover:bg-opacity-10"
                    href={`/palates/music/playlists/${id}`}
                  >
                    <img
                      alt=""
                      src={images?.[0].url}
                      className="aspect-square h-full w-full rounded object-cover"
                    />
                    <div className="overflow-clip text-ellipsis whitespace-nowrap font-semibold">
                      {name}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Layout>
  );
}
