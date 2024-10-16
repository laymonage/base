interface RefreshTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: string;
}

export interface NowPlaying {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  trackUrl: string;
}

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE_URL = 'https://accounts.spotify.com';

const ENDPOINTS = {
  NOW_PLAYING: `${SPOTIFY_API_BASE_URL}/me/player/currently-playing`,
  TOKEN: `${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`,
};

const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN;

// Authentication stuff

const getAccessToken = async (): Promise<RefreshTokenResponse> => {
  const auth = {
    basic: Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    refreshToken,
  };

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

// API functions

export const getNowPlaying = async () =>
  fetch(ENDPOINTS.NOW_PLAYING, {
    headers: {
      Authorization: `Bearer ${(await getAccessToken()).access_token}`,
    },
  });

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
