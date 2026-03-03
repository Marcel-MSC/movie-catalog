import type { Movie } from '../types';
import type { SampleApisMovie } from '../types/apis/sampleApis';

const SAMPLE_APIS_BASE_URL = 'https://api.sampleapis.com/movies';

export const mapSampleApisMovieToMovie = (movie: SampleApisMovie): Movie => {
  const releaseDate =
    typeof movie.year === 'number' ? String(movie.year) : movie.year;

  const voteAverage = movie.imdbRating ? Number(movie.imdbRating) : undefined;

  const taglineParts: string[] = [];
  if (movie.director) taglineParts.push(`Directed by ${movie.director}`);
  if (movie.actors) taglineParts.push(`Starring ${movie.actors}`);

  return {
    id: movie.imdbId ?? String(movie.id ?? movie.title),
    movie_id: movie.id ?? 0,
    original_title: movie.title,
    overview: movie.plot,
    release_date: releaseDate,
    vote_average: Number.isNaN(voteAverage) ? undefined : voteAverage,
    poster_path: movie.posterURL,
    genres: movie.genres?.map((name, index) => ({
      id: index,
      name,
    })),
    tagline: taglineParts.length > 0 ? taglineParts.join(' • ') : undefined,
  };
};

export const fetchAllMoviesFromSampleApis = async (): Promise<Movie[]> => {
  // Use uma coleção temática para limitar o volume de dados
  const response = await fetch(`${SAMPLE_APIS_BASE_URL}/animation`);

  if (!response.ok) {
    throw new Error(`SampleAPIs HTTP error! status: ${response.status}`);
  }

  const rawMovies = (await response.json()) as SampleApisMovie[];
  return rawMovies.map(mapSampleApisMovieToMovie);
};

