import { NowPlaying, RefreshTokenResponse } from '../models/spotify';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE_URL = 'https://accounts.spotify.com';

const ENDPOINTS = {
  NOW_PLAYING: `${SPOTIFY_API_BASE_URL}/me/player/currently-playing`,
  TOP_TRACKS: `${SPOTIFY_API_BASE_URL}/me/top/tracks`,
  TOKEN: `${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`,
};

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

// Authentication stuff

const auth = {
  basic: Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
  refreshToken,
};

const getAccessToken = async (): Promise<RefreshTokenResponse> => {
  const response = await fetch(ENDPOINTS.TOKEN, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth.basic}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: auth.refreshToken,
    } as Record<string, string>),
  });

  return response.json();
};

// Utilities

const fetchWith = {
  async accessToken(endpoint: string) {
    const { access_token } = await getAccessToken();

    return fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  },
};

// API functions

export const getNowPlaying = async () =>
  fetchWith.accessToken(ENDPOINTS.NOW_PLAYING);

export const getTopTracks = async () =>
  fetchWith.accessToken(ENDPOINTS.TOP_TRACKS);

// Adapter functions

export const adaptNowPlaying = (
  track: SpotifyApi.CurrentlyPlayingObject,
): NowPlaying => {
  const isPlaying = track.is_playing && !!track.item;
  let title = '';
  let artist = '';
  let album = '';
  let albumImageUrl = '';
  let trackUrl = '';

  if (track.item) {
    title = track.item.name;
    trackUrl = track.item.external_urls.spotify;
    if ('artists' in track.item) {
      // Currently playing track
      artist = track.item.artists.map((artist) => artist.name).join(', ');
      album = track.item.album.name;
      albumImageUrl = track.item.album.images[0]?.url || '';
    } else {
      // Currently playing episode
      artist = track.item.show.publisher;
      album = track.item.show.name;
      albumImageUrl = track.item.show.images[0]?.url || '';
    }
  }

  return {
    isPlaying,
    title,
    artist,
    album,
    albumImageUrl,
    trackUrl,
  };
};
