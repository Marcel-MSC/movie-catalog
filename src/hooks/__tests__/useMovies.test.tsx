import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useMovies } from '../useMovies';
import type { Movie } from '../../types';
import { fetchAllMovies } from '../../services/movieService';

vi.mock('../../services/movieService', () => {
  return {
    fetchAllMovies: vi.fn(),
  };
});

const createMovie = (index: number): Movie => ({
  id: `movie-${index}`,
  movie_id: index,
  original_title: `Movie ${index}`,
});

describe('useMovies', () => {
  const fetchAllMoviesMock = fetchAllMovies as unknown as vi.Mock;

  beforeEach(() => {
    fetchAllMoviesMock.mockReset();
  });

  it('loads movies on mount and exposes initial page', async () => {
    const movies = Array.from({ length: 25 }, (_, i) => createMovie(i + 1));
    fetchAllMoviesMock.mockResolvedValueOnce(movies);

    const { result } = renderHook(() => useMovies());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies.length).toBe(20);
    expect(result.current.hasMore).toBe(true);
  });

  it('filters movies by search query and resets pagination', async () => {
    const movies = [
      createMovie(1),
      { ...createMovie(2), original_title: 'Star Wars' },
      { ...createMovie(3), original_title: 'Another Star Story' },
    ];

    fetchAllMoviesMock.mockResolvedValueOnce(movies);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.searchMovies('star');
    });

    await waitFor(() => {
      expect(result.current.movies.length).toBe(2);
    });
  });

  it('loads more movies and updates hasMore correctly', async () => {
    const movies = Array.from({ length: 25 }, (_, i) => createMovie(i + 1));
    fetchAllMoviesMock.mockResolvedValueOnce(movies);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies.length).toBe(20);
    expect(result.current.hasMore).toBe(true);

    act(() => {
      result.current.loadMoreMovies();
    });

    expect(result.current.movies.length).toBe(25);
    expect(result.current.hasMore).toBe(false);
  });
});

