import { vi } from 'vitest';

import { fetchAllMovies } from '../movieService';
import type { PaginatedResponse } from '../../types';
import fallbackResponse from '../../data/movies.json';

describe('fetchAllMovies', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('fetches movies successfully from tvmaze source by default', async () => {
    const page1: PaginatedResponse = {
      ...(fallbackResponse as PaginatedResponse),
      current_page: 1,
      last_page: 1,
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => page1.data,
    });

    // @ts-expect-error - overriding global fetch for test
    global.fetch = fetchMock;

    const movies = await fetchAllMovies('tvmaze');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(movies.length).toBe(page1.data.length);
  });

  it('falls back to local JSON when the API fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));

    // @ts-expect-error - overriding global fetch for test
    global.fetch = fetchMock;

    const movies = await fetchAllMovies('tvmaze');

    expect(fetchMock).toHaveBeenCalled();
    expect(movies.length).toBe((fallbackResponse as PaginatedResponse).data.length);
  });
});

