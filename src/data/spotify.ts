import data from './saved_tracks_simplified.json';

interface ExternalURLs {
  spotify: string;
}

interface Image {
  width: number;
  height: number;
  url: string;
}

interface AlbumSimplified {
  id: string;
  name: string;
  release_date: string;
  images: Image[];
}

interface ArtistSimplified {
  id: string;
  name: string;
  external_urls: ExternalURLs;
}

interface SavedTrackSimplified {
  id: string;
  name: string;
  added_at: string;
  popularity: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalURLs;
  preview_url: string;
  album: AlbumSimplified;
  artists: ArtistSimplified[];
}

interface SavedTracksData {
  total: number;
  tracks: SavedTrackSimplified[];
}

export default data as SavedTracksData;
