import cn from 'classnames';
import useSWR from 'swr';
import { fetcher } from 'lib/fetcher';
import { NowPlaying as iNowPlaying } from 'lib/models/spotify';
import Spotify from './icons/Spotify.svg';

const SpotifyLogo = ({ isPlaying }: { isPlaying: boolean }) => (
  <div
    className={cn('flex-shrink-0', {
      'w-8 h-8': isPlaying,
      'w-6 h-6': !isPlaying,
    })}
  >
    <Spotify />
  </div>
);

const NowPlaying = () => {
  const { data } = useSWR<iNowPlaying>('/api/now-playing', fetcher);
  const isPlaying = data?.isPlaying;

  return (
    <>
      {isPlaying ? (
        <a
          className="flex items-center max-w-full ml-auto"
          href={data.trackUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <div className="flex flex-col mr-4 text-right truncate">
            <p className="truncate">{data.artist}</p>
            <p className="truncate">{data.title}</p>
          </div>
          <SpotifyLogo isPlaying={isPlaying} />
        </a>
      ) : (
        <>
          <p className="mr-4">Not playing</p>
          <SpotifyLogo isPlaying={isPlaying} />
        </>
      )}
    </>
  );
};
export default NowPlaying;
