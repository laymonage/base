import { useAudio } from '@/lib/providers/audio';
import { useEffect, useRef } from 'react';
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from '@tabler/icons-react';

interface TrackPreviewProps {
  number: number;
  title: string;
  artists: string[];
  previewUrl: string | null;
}

export default function TrackPreview({
  number,
  title,
  artists,
  previewUrl,
}: TrackPreviewProps) {
  const [state, dispatch] = useAudio();
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const element = audio.current;
    if (!element || !previewUrl) return;
    // Clean up the audio element when the component unmounts
    return () => {
      element.remove();
      element.srcObject = null;
    };
  }, [previewUrl]);

  if (!previewUrl) return <>{number}</>;

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
      aria-label={`Preview ${title} by ${artists.join(', ')}`}
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
        {isPlaying ? (
          <IconPlayerPauseFilled fill="currentColor" width={16} height={16} />
        ) : (
          <IconPlayerPlayFilled fill="currentColor" width={16} height={16} />
        )}
      </span>
      {previewUrl ? <audio ref={audio} src={previewUrl} /> : null}
    </button>
  );
}
