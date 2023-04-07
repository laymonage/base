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
      className="group"
      type="button"
      onClick={togglePlay}
      aria-label={`Play ${title} by ${artists.join(', ')}`}
    >
      <span className="group-hover/row:hidden group-focus-within:group-focus-visible:hidden">
        {isPlaying ? (
          <img
            className="h-3.5 w-3.5"
            alt="Is currently playing"
            src="/img/equaliser-animated-green.gif"
          />
        ) : (
          number
        )}
      </span>
      <span className="hidden group-hover/row:inline group-focus-within:group-focus-visible:inline">
        {isPlaying ? '⏸️' : '▶️'}
      </span>
      <audio src={previewUrl} />
    </button>
  );
}
