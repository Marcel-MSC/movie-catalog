import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../store/hooks';
import * as ratingStorage from '../services/ratingStorage';
import type { Movie, UserMovieRating } from '../types';

export function useMovieRating() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const userKey = currentUser?.email ?? 'anonymous';

  const [ratingsByMovie, setRatingsByMovie] = useState<Record<string, UserMovieRating>>(() =>
    ratingStorage.getAllRatingsForUser(userKey),
  );

  useEffect(() => {
    setRatingsByMovie(ratingStorage.getAllRatingsForUser(userKey));
  }, [userKey]);

  const getRating = useCallback(
    (movieId: string): UserMovieRating | undefined => ratingsByMovie[movieId],
    [ratingsByMovie],
  );

  const setRating = useCallback(
    (movie: Movie, stars: number, comment: string) => {
      const movieReleaseYear =
        movie.release_date && movie.release_date.length >= 4
          ? movie.release_date.slice(0, 4)
          : movie.release_date ?? undefined;

      const rating: UserMovieRating = {
        stars,
        comment: comment ?? '',
        updatedAt: new Date().toISOString(),
        movieTitle: movie.original_title,
        moviePosterPath: movie.poster_path,
        movieReleaseYear,
      };

      ratingStorage.setRating(userKey, movie.id, rating);
      setRatingsByMovie((prev) => ({
        ...prev,
        [movie.id]: rating,
      }));
    },
    [userKey],
  );

  return { getRating, setRating, allRatings: ratingsByMovie };
}
