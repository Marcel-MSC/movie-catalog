import type { Movie } from '../types';
import type { GhibliMovie } from '../types/apis/ghibli';

const GHIBLI_BASE_URL = 'https://ghibliapi.vercel.app/films';

export const mapGhibliMovieToMovie = (film: GhibliMovie): Movie => {
  const runtime = Number(film.running_time);
  const rtScore = Number(film.rt_score);

  return {
    id: film.id,
    movie_id: Number(film.id.length),
    original_title: film.title,
    overview: film.description,
    release_date: film.release_date,
    runtime: Number.isNaN(runtime) ? undefined : runtime,
    vote_average: Number.isNaN(rtScore) ? undefined : rtScore,
    poster_path: film.image ?? film.movie_banner ?? undefined,
    tagline: film.original_title,
    genres: [
      {
        id: 1,
        name: 'Ghibli',
      },
    ],
  };
};

export const fetchAllMoviesFromGhibli = async (): Promise<Movie[]> => {
  const response = await fetch(GHIBLI_BASE_URL);

  if (!response.ok) {
    throw new Error(`Ghibli HTTP error! status: ${response.status}`);
  }

  const films = (await response.json()) as GhibliMovie[];
  return films.map(mapGhibliMovieToMovie);
};

