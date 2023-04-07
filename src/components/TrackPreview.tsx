import { useAudio } from '@/lib/providers/audio';

interface TrackPreviewProps {
  title: string;
  album: string;
  imageUrl: string;
  artists: string[];
  previewUrl: string;
}

export default function TrackPreview({
  title,
  artists,
  previewUrl,
  album,
  imageUrl,
}: TrackPreviewProps) {
  const [state, dispatch] = useAudio();
  const isCurrent = state.audio?.src === previewUrl;
  const isPlaying = isCurrent && state.playing;

  const togglePlay = () => {
    if (!isCurrent) {
      dispatch({ type: 'SET_SRC', src: previewUrl });
      dispatch({ type: 'PLAY' });
      return;
    }
    dispatch({ type: 'TOGGLE' });
  };

  return (
    <div className="group relative flex-shrink-0">
      <audio src={previewUrl} />
      <img
        alt={album}
        src={imageUrl}
        className="h-8 w-8 group-focus-within:opacity-50 group-hover:opacity-50"
        loading="lazy"
      />
      <button
        type="button"
        onClick={togglePlay}
        aria-label={`Play ${title} by ${artists.join(', ')}`}
        className="absolute top-0 left-0 h-8 w-8 opacity-0 focus:opacity-100 group-hover:opacity-100"
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
    </div>
  );
}
