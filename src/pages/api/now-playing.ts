import type { APIRoute } from 'astro';

import { adaptNowPlaying, getNowPlaying } from '../../lib/spotify';

export const GET: APIRoute = async () => {
  const response = await getNowPlaying();
  let result: Record<string, any>;

  if (response.status !== 200) {
    result = { isPlaying: false };
  } else {
    result = adaptNowPlaying(await response.json());
  }

  return new Response(JSON.stringify(result), {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
};
