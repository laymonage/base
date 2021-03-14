// Spotify Accounts API schema

export interface RefreshTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: string;
}

// Spotify API objects

export interface AlbumRestriction {
  reason: 'market' | 'product' | 'explicit' | string;
}

export interface Context {
  external_urls: ExternalUrl;
  href: string;
  type: string;
  uri: string;
}

export interface CurrentlyPlaying {
  actions: {
    disallows: Disallows;
  };
  context: Context | null;
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
  is_playing: boolean;
  item: Track | null;
  progress_ms: number | null;
  timestamp: number;
}

export interface Disallows {
  interrupting_playback?: boolean;
  pausing?: boolean;
  resuming?: boolean;
  seeking?: boolean;
  skipping_next?: boolean;
  skipping_prev?: boolean;
  toggling_repeat_context?: boolean;
  toggling_repeat_track?: boolean;
  toggling_shuffle?: boolean;
  transferring_playback?: boolean;
}

export interface ExternalId {
  ean?: string;
  isrc?: string;
  upc?: string;
}

export interface ExternalUrl {
  spotify: string;
}

export interface Image {
  height?: number;
  url: string;
  width?: number;
}

export interface SimplifiedAlbum {
  album_group?: 'album' | 'single' | 'compilation' | 'appears_on';
  album_type: 'album' | 'single' | 'compilation';
  artists: SimplifiedArtist[];
  available_markets: string[];
  external_urls: ExternalUrl;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  restriction?: AlbumRestriction;
  total_tracks?: number;
  type: 'album';
  uri: string;
}

export interface SimplifiedArtist {
  external_urls: ExternalUrl;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
}

export interface Track {
  album: SimplifiedAlbum;
  artists: SimplifiedArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalId;
  external_urls: ExternalUrl;
  href: string;
  id: string;
  is_local: boolean;
  is_playable?: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  restrictions?: TrackRestriction;
  track_number: number;
  type: 'track';
  uri: string;
}

export interface TrackRestriction {
  reason: 'market' | 'product' | 'explicit' | string;
}

// Custom interfaces

export interface NowPlaying {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  trackUrl: string;
}
