// Spotify Accounts API schema

export interface RefreshTokenResponse {
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

export interface TrackSimplified {
  id: string;
  name: string;
  added_at: string;
  popularity: number;
  duration_ms: number;
  explicit: boolean;
  url: string;
  preview_url: string | null;
  album: {
    id: string;
    name: string;
    release_date: string;
    image_url: string;
    url: string;
  };
  artists: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

export type PlaylistFull = Omit<SpotifyApi.PlaylistObjectFull, 'tracks'> & {
  tracks: SpotifyApi.PlaylistTrackObject[];
};
