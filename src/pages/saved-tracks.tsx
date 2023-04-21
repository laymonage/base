import Layout from '@/components/Layout';
import SpotifyTracksTable from '@/components/SpotifyTracksTable';
import { ComponentProps, useEffect, useState } from 'react';

const SPOTIFY_SAVED_TRACKS_RAW_URL =
  'https://raw.githubusercontent.com/laymonage/spotify-saved-tracks';
const SPOTIFY_SAVED_TRACKS_DATA_URL = `${SPOTIFY_SAVED_TRACKS_RAW_URL}/data/data`;
const SPOTIFY_SAVED_TRACKS_DATA_FILE = 'saved_tracks_simplified.json';

type SpotifySavedTracksData = ComponentProps<typeof SpotifyTracksTable>['data'];

export default function Selections() {
  const [data, setData] = useState<SpotifySavedTracksData>([]);

  useEffect(() => {
    fetch(`${SPOTIFY_SAVED_TRACKS_DATA_URL}/${SPOTIFY_SAVED_TRACKS_DATA_FILE}`)
      .then((response) => response.json())
      .then(({ tracks }) => setData(tracks));
  }, []);

  return (
    <Layout
      customMeta={{ title: 'Selections', description: `Selections of things.` }}
    >
      <SpotifyTracksTable
        data={data}
        className="bleed w-full max-w-4xl place-self-center"
      />
    </Layout>
  );
}
