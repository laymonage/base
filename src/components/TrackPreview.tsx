import { useAudio } from '@/lib/providers/audio';

interface TrackPreviewProps {
  number: number;
  title: string;
  artists: string[];
  previewUrl: string;
}

export default function TrackPreview({
  number,
  title,
  artists,
  previewUrl,
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
    <button
      type="button"
      onClick={togglePlay}
      aria-label={`Play ${title} by ${artists.join(', ')}`}
    >
      <span className="group-focus-within:hidden group-hover:hidden">
        {number}
      </span>
      <span className="hidden group-focus-within:inline group-hover:inline">
        {isPlaying ? '⏸️' : '▶️'}
      </span>
      <audio src={previewUrl} />
    </button>
  );
}
