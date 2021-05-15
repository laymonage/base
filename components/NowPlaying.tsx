import clsx from 'clsx';
import useSWR from 'swr';
import { fetcher } from 'lib/fetcher';
import { NowPlaying as iNowPlaying } from 'lib/models/spotify';
import Spotify from './icons/Spotify.svg';

const SPOTIFY_PROFILE_URL = 'https://open.spotify.com/user/laymonage';

const NowPlaying = () => {
  const { data } = useSWR<iNowPlaying>('/api/now-playing', fetcher);
  const isPlaying = data?.isPlaying;

  return (
    <>
      <a
        className="flex items-center max-w-full ml-auto"
        href={isPlaying ? data?.trackUrl : SPOTIFY_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        <div className="flex flex-col mr-4 text-right truncate">
          {isPlaying ? (
            <>
              <p className="truncate">{data.artist}</p>
              <p className="truncate">{data.title}</p>
            </>
          ) : (
            <p>Not playing</p>
          )}
        </div>
        <div
          className={clsx('flex-shrink-0', {
            'w-8 h-8': isPlaying,
            'w-6 h-6': !isPlaying,
          })}
        >
          <Spotify />
        </div>
      </a>
    </>
  );
};
export default NowPlaying;
