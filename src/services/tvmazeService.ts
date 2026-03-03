import type { Movie } from '../types';
import type { TvmazeShow } from '../types/apis/tvmaze';

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

const stripHtml = (value: string | null | undefined): string | undefined => {
  if (!value) return undefined;
  return value.replace(/<[^>]+>/g, '').trim() || undefined;
};

export const mapShowToMovie = (show: TvmazeShow): Movie => {
  return {
    id: String(show.id),
    movie_id: show.id,
    original_title: show.name,
    overview: stripHtml(show.summary),
    release_date: show.premiered ?? undefined,
    vote_average: show.rating?.average ?? undefined,
    poster_path: show.image?.medium ?? show.image?.original ?? undefined,
    original_language: show.language,
    genres: show.genres?.map((name, index) => ({
      id: index,
      name,
    })),
  };
};

export const fetchAllMoviesFromTvmaze = async (): Promise<Movie[]> => {
  const response = await fetch(`${TVMAZE_BASE_URL}/shows?page=0`);

  if (!response.ok) {
    throw new Error(`TVMaze HTTP error! status: ${response.status}`);
  }

  const shows = (await response.json()) as TvmazeShow[];
  return shows.map(mapShowToMovie);
};

