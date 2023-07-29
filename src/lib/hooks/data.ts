import { useState, useEffect } from 'react';

class NetworkError extends Error {
  declare response: Response;
  constructor(
    message: string,
    options?: ErrorOptions & { response: Response },
  ) {
    const { response, ...rest } = options || {};
    super(message, rest);
    if (response) this.response = response;
  }
}

export const useData = <T>(url: string, init?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) return;
    let ignore = false;
    const abortController = new AbortController();

    fetch(url, { signal: abortController.signal, ...init })
      .then((response) => {
        if (response.ok) return response.json();
        throw new NetworkError(response.statusText, { response });
      })
      .then((json) => {
        if (!ignore) setData(json);
      })
      .catch((error) => {
        if (!ignore) setError(error);
      });

    return () => {
      ignore = true;
      abortController.abort();
    };
  }, [url, init]);
  return [data, error] as [T, null] | [null, Error];
};
