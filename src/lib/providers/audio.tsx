import {
  createContext,
  useReducer,
  Dispatch,
  useContext,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

interface AudioState {
  audio: HTMLAudioElement | null;
  playing: boolean;
}

const initialState: AudioState = {
  audio: null,
  playing: false,
};

const AudioContext = createContext<AudioState>(initialState);

interface AudioInitAction {
  type: 'INIT';
  audio: HTMLAudioElement;
}

interface AudioPlaybackAction {
  type: 'PLAY' | 'PAUSE' | 'TOGGLE';
}

interface AudioSetSrcAction {
  type: 'SET_SRC';
  src: string;
}

type AudioAction = AudioInitAction | AudioPlaybackAction | AudioSetSrcAction;

function audioReducer(state: AudioState, action: AudioAction) {
  switch (action.type) {
    case 'INIT':
      return { ...state, audio: action.audio };
    case 'PLAY':
      state.audio?.play();
      return { ...state, playing: true };
    case 'PAUSE':
      state.audio?.pause();
      return { ...state, playing: false };
    case 'TOGGLE':
      state.playing ? state.audio?.pause() : state.audio?.play();
      return { ...state, playing: !state.playing };
    case 'SET_SRC':
      if (state.audio) {
        state.audio.src = action.src;
        state.audio.load();
      }
      return state;
    default:
      return state;
  }
}

const AudioDispatchContext = createContext<Dispatch<AudioAction>>(
  () => undefined,
);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (state.audio || !audio.current) return;
    dispatch({ type: 'INIT', audio: audio.current });
  }, [state.audio]);

  return (
    <AudioContext.Provider value={state}>
      <AudioDispatchContext.Provider value={dispatch}>
        {children}
        <audio ref={audio} />
      </AudioDispatchContext.Provider>
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return [useContext(AudioContext), useContext(AudioDispatchContext)] as const;
}
