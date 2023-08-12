const SPOTIFY_DATA_RAW_URL =
  'https://raw.githubusercontent.com/laymonage/spotify-to-github';
const SPOTIFY_DATA_BRANCH_URL = `${SPOTIFY_DATA_RAW_URL}/data/data`;

export function getSpotifyDataURL(filename: string, format = 'json') {
  return `${SPOTIFY_DATA_BRANCH_URL}/${filename}.${format}`;
}
