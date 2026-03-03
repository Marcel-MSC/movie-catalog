/**
 * TEMPLATE: Reference for adding new public HTTP movie sources (no auth).
 *
 * To add a new source:
 * 1. Create a type in src/types/apis/ for the raw payload (e.g. XxxMovie).
 * 2. Implement mapXToMovie(raw: XxxMovie): Movie.
 * 3. Implement fetchAllMoviesFromX(): Promise<Movie[]>.
 * 4. Add the source to DataSource in src/types/index.ts.
 * 5. Add a case in movieService.ts.
 * 6. Add a button in App.tsx.
 *
 * @see README "Adding new public movie sources (no auth)"
 */

/*
import type { Movie } from '../types';
import type { XxxMovie } from '../types/apis/xxx';

const XXX_BASE_URL = 'https://example.com/api/movies';

export const mapXToMovie = (raw: XxxMovie): Movie => {
  return {
    id: raw.id ?? String(raw.title),
    movie_id: raw.id ?? 0,
    original_title: raw.title ?? raw.name,
    overview: raw.description ?? raw.plot ?? raw.summary,
    release_date: raw.year ? String(raw.year) : raw.release_date,
    vote_average: raw.rating ?? raw.vote_average,
    poster_path: raw.poster ?? raw.image ?? raw.posterURL,
    genres: raw.genres?.map((g, i) => ({ id: i, name: typeof g === 'string' ? g : g.name })),
    tagline: raw.tagline,
    runtime: raw.runtime ?? raw.duration,
    original_language: raw.language,
  };
};

export const fetchAllMoviesFromX = async (): Promise<Movie[]> => {
  const response = await fetch(XXX_BASE_URL);
  if (!response.ok) {
    throw new Error(`XXX HTTP error! status: ${response.status}`);
  }
  const raw = (await response.json()) as XxxMovie[] | { data: XxxMovie[] };
  const items = Array.isArray(raw) ? raw : (raw as { data: XxxMovie[] }).data ?? [];
  return items.map(mapXToMovie);
};
*/

export {};
