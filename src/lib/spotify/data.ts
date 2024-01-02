import { AddedTrack, TrackSimplified } from '../models/spotify';

const SPOTIFY_DATA_RAW_URL =
  'https://raw.githubusercontent.com/laymonage/spotify-to-github';
const SPOTIFY_DATA_BRANCH_URL = `${SPOTIFY_DATA_RAW_URL}/data/data`;

export function getSpotifyDataURL(filename: string, format = 'json') {
  return `${SPOTIFY_DATA_BRANCH_URL}/${filename}.${format}`;
}

export function simplifyPlaylistTrack({
  added_at,
  track,
}: AddedTrack): TrackSimplified {
  return simplifyTrack(track as SpotifyApi.TrackObjectFull, added_at);
}

export function simplifyTrack(
  t: SpotifyApi.TrackObjectFull,
  added_at = '1970-01-01',
): TrackSimplified {
  const url = t.external_urls.spotify || '';
  const album = {
    ...t.album,
    image_url:
      t.album.images[0]?.url ||
      'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png',
    url: t.album.external_urls.spotify || '',
  };
  const artists = t.artists.map((artist) => ({
    ...artist,
    url: artist.external_urls.spotify || '',
  }));
  return { added_at, url, ...t, album, artists };
}
