import type { UserMovieRating } from '../types';

const RATINGS_KEY = 'mc_ratings';

type RatingsData = Record<string, Record<string, UserMovieRating>>;

function getData(): RatingsData {
  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem(RATINGS_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as RatingsData;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function setData(data: RatingsData): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(RATINGS_KEY, JSON.stringify(data));
}

/**
 * Returns all ratings for a user (or anonymous). One read + parse per call.
 */
export function getAllRatingsForUser(userKey: string): Record<string, UserMovieRating> {
  const data = getData();
  const userRatings = data[userKey];
  if (!userRatings || typeof userRatings !== 'object') return {};
  return userRatings;
}

/**
 * Saves or updates a rating for a movie. One read and one write.
 */
export function setRating(
  userKey: string,
  movieId: string,
  rating: UserMovieRating,
): void {
  const data = getData();
  if (!data[userKey]) data[userKey] = {};
  data[userKey][movieId] = rating;
  setData(data);
}
