import { NextApiRequest, NextApiResponse } from 'next';
import { adaptNowPlaying, getNowPlaying } from '@/lib/spotify';
import { CurrentlyPlaying } from '@/lib/models/spotify';

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const response = await getNowPlaying();

  if (response.status !== 200) {
    return res.status(200).json({ isPlaying: false });
  }

  const track: CurrentlyPlaying = await response.json();
  const nowPlaying = adaptNowPlaying(track);

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

  return res.status(200).json(nowPlaying);
};
