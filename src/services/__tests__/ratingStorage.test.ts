import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAllRatingsForUser, setRating } from '../ratingStorage';
import type { UserMovieRating } from '../../types';

describe('ratingStorage', () => {
  const originalLocalStorage = global.localStorage;

  beforeEach(() => {
    const store: Record<string, string> = {};
    // @ts-expect-error - simple mock for localStorage in tests
    global.localStorage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
      key: vi.fn(),
      length: 0,
    };
  });

  afterEach(() => {
    // @ts-expect-error restore
    global.localStorage = originalLocalStorage;
  });

  it('returns empty object when no ratings stored', () => {
    const result = getAllRatingsForUser('anonymous');
    expect(result).toEqual({});
  });

  it('returns empty object for unknown userKey when data exists for another user', () => {
    const rating: UserMovieRating = {
      stars: 4,
      comment: 'Great',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    setRating('user@test.com', 'movie-1', rating);
    const result = getAllRatingsForUser('anonymous');
    expect(result).toEqual({});
  });

  it('saves and retrieves rating for a user and movie', () => {
    const rating: UserMovieRating = {
      stars: 5,
      comment: 'Loved it',
      updatedAt: '2024-01-02T00:00:00.000Z',
    };
    setRating('user@test.com', 'movie-1', rating);
    const all = getAllRatingsForUser('user@test.com');
    expect(all['movie-1']).toBeDefined();
    expect(all['movie-1'].stars).toBe(5);
    expect(all['movie-1'].comment).toBe('Loved it');
    expect(all['movie-1'].updatedAt).toBeDefined();
    expect(typeof all['movie-1'].updatedAt).toBe('string');
  });

  it('overwrites rating for same user and movie', () => {
    const firstRating: UserMovieRating = {
      stars: 3,
      comment: 'OK',
      updatedAt: '2024-01-03T00:00:00.000Z',
    };
    const secondRating: UserMovieRating = {
      stars: 4,
      comment: 'Better',
      updatedAt: '2024-01-04T00:00:00.000Z',
    };
    setRating('user@test.com', 'movie-1', firstRating);
    setRating('user@test.com', 'movie-1', secondRating);
    const all = getAllRatingsForUser('user@test.com');
    expect(all['movie-1'].stars).toBe(4);
    expect(all['movie-1'].comment).toBe('Better');
  });

  it('handles invalid JSON without throwing', () => {
    global.localStorage.setItem('mc_ratings', 'not valid json');
    const result = getAllRatingsForUser('anonymous');
    expect(result).toEqual({});
  });
});
