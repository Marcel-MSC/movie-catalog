import type { Movie } from '../types';
import type { StaticJsonMovie } from '../types/apis/staticJson';

/**
 * URL for the static movies JSON.
 * Can be a same-origin path (/static-movies.json) or an external raw GitHub URL.
 * Same-origin avoids CORS; external URLs require CORS to be enabled on the host.
 */
const STATIC_MOVIES_URL = '/static-movies.json';

export const mapStaticJsonMovieToMovie = (raw: StaticJsonMovie): Movie => {
  const overview =
    raw.overview ?? raw.plot ?? raw.description ?? undefined;

  const releaseDate =
    raw.release_date ??
    (raw.year ? String(raw.year) : undefined);

  const voteAverage =
    raw.vote_average ?? raw.rating;
  const safeVote =
    voteAverage != null ? Number(voteAverage) : undefined;

  const posterPath =
    raw.poster_path ??
    raw.poster ??
    raw.image ??
    raw.posterURL ??
    undefined;

  const runtime =
    typeof raw.runtime === 'number'
      ? raw.runtime
      : typeof raw.runtime === 'string'
        ? Number(raw.runtime)
        : undefined;

  const taglineParts: string[] = [];
  if (raw.tagline) taglineParts.push(raw.tagline);
  if (raw.director) taglineParts.push(`Directed by ${raw.director}`);
  if (raw.actors) taglineParts.push(`Starring ${raw.actors}`);

  const genres = Array.isArray(raw.genres)
    ? raw.genres.map((g, i) =>
        typeof g === 'string'
          ? { id: i, name: g }
          : { id: g.id ?? i, name: g.name }
      )
    : undefined;

  const castNames = raw.cast ?? (raw.actors ? raw.actors.split(',').map((a) => a.trim()) : []);
  const casts =
    castNames.length > 0
      ? castNames.map((name, i) => ({
          id: `cast-${raw.id ?? 'static'}-${i}`,
          name: typeof name === 'string' ? name : String(name),
        }))
      : undefined;

  return {
    id: String(raw.id ?? raw.title),
    movie_id:
      typeof raw.id === 'number'
        ? raw.id
        : raw.id
          ? String(raw.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
          : 0,
    original_title: raw.title,
    overview,
    release_date: releaseDate,
    vote_average: safeVote != null && !Number.isNaN(safeVote) ? safeVote : undefined,
    poster_path: posterPath,
    runtime: runtime != null && !Number.isNaN(runtime) ? runtime : undefined,
    tagline: taglineParts.length > 0 ? taglineParts.join(' • ') : undefined,
    original_language: raw.original_language ?? raw.language,
    genres,
    casts,
  };
};

export const fetchAllMoviesFromStaticJson = async (): Promise<Movie[]> => {
  const response = await fetch(STATIC_MOVIES_URL);

  if (!response.ok) {
    throw new Error(`Static JSON HTTP error! status: ${response.status}`);
  }

  const raw = (await response.json()) as StaticJsonMovie[] | { data: StaticJsonMovie[] };
  const items = Array.isArray(raw) ? raw : (raw as { data: StaticJsonMovie[] }).data ?? [];
  return items.map(mapStaticJsonMovieToMovie);
};
