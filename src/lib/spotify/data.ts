import { TrackSimplified } from '../models/spotify';

const SPOTIFY_DATA_RAW_URL =
  'https://raw.githubusercontent.com/laymonage/spotify-to-github';
const SPOTIFY_DATA_BRANCH_URL = `${SPOTIFY_DATA_RAW_URL}/data/data`;

export function getSpotifyDataURL(filename: string, format = 'json') {
  return `${SPOTIFY_DATA_BRANCH_URL}/${filename}.${format}`;
}

export function simplifyPlaylistTrack({
  added_at,
  track,
}: SpotifyApi.PlaylistTrackObject): TrackSimplified {
  const t = track as SpotifyApi.TrackObjectFull;
  const url = t.external_urls.spotify;
  const album = {
    ...t.album,
    image_url: t.album.images[0]?.url,
    url: t.album.external_urls.spotify,
  };
  const artists = t.artists.map((artist) => ({
    ...artist,
    url: artist.external_urls.spotify,
  }));
  return { added_at, url, ...t, album, artists };
}
