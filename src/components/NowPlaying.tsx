import clsx from 'clsx';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { NowPlaying as iNowPlaying } from '@/lib/models/spotify';
import Spotify from './icons/Spotify.svg';

const SPOTIFY_PROFILE_URL = 'https://open.spotify.com/user/laymonage';

export default function NowPlaying() {
  const { data } = useSWR<iNowPlaying>('/api/now-playing', fetcher);
  const isPlaying = data?.isPlaying;

  return (
    <a
      className="ml-auto flex min-h-[56px] max-w-full items-center"
      href={isPlaying ? data?.trackUrl : SPOTIFY_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      <div className="mr-4 flex flex-col truncate text-right">
        {data && isPlaying ? (
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
          'h-8 w-8': isPlaying,
          'h-6 w-6': !isPlaying,
        })}
      >
        <Spotify className="fill-black dark:fill-white" />
      </div>
    </a>
  );
}
