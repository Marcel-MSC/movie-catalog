import { describe, it, expect } from 'vitest';
import type { TvmazeShow } from '../../types/apis/tvmaze';
import type { SampleApisMovie } from '../../types/apis/sampleApis';
import type { GhibliMovie } from '../../types/apis/ghibli';
import type { StaticJsonMovie } from '../../types/apis/staticJson';
import { mapShowToMovie } from '../tvmazeService';
import { mapSampleApisMovieToMovie } from '../sampleApisService';
import { mapGhibliMovieToMovie } from '../ghibliService';
import { mapStaticJsonMovieToMovie } from '../staticJsonService';

describe('API mappers to Movie', () => {
  it('maps Tvmaze show to Movie with cleaned summary and genres', () => {
    const show: TvmazeShow = {
      id: 1,
      name: 'Test Show',
      summary: '<p>Some <strong>HTML</strong> summary</p>',
      premiered: '2020-01-01',
      rating: { average: 7.5 },
      image: { medium: 'medium.jpg', original: 'original.jpg' },
      language: 'en',
      genres: ['Drama', 'Sci-Fi'],
    };

    const movie = mapShowToMovie(show);

    expect(movie.original_title).toBe('Test Show');
    expect(movie.overview).toBe('Some HTML summary');
    expect(movie.genres).toHaveLength(2);
    expect(movie.original_language).toBe('en');
  });

  it('maps SampleAPIs movie to Movie with tagline and rating', () => {
    const sample: SampleApisMovie = {
      id: 10,
      title: 'Sample Movie',
      year: 2021,
      genres: ['Comedy'],
      director: 'Jane Doe',
      actors: 'Actor One, Actor Two',
      plot: 'A funny movie.',
      imdbId: 'tt1234567',
      imdbRating: '8.1',
      posterURL: 'poster.jpg',
    };

    const movie = mapSampleApisMovieToMovie(sample);

    expect(movie.original_title).toBe('Sample Movie');
    expect(movie.overview).toBe('A funny movie.');
    expect(movie.vote_average).toBe(8.1);
    expect(movie.genres?.[0].name).toBe('Comedy');
    expect(movie.tagline).toContain('Directed by Jane Doe');
  });

  it('maps Ghibli movie to Movie with runtime, score, and synthetic genre', () => {
    const film: GhibliMovie = {
      id: 'ghibli-1',
      title: 'Spirited Away',
      original_title: 'Sen to Chihiro no Kamikakushi',
      description: 'A magical story.',
      director: 'Hayao Miyazaki',
      producer: 'Toshio Suzuki',
      release_date: '2001',
      running_time: '125',
      rt_score: '97',
      image: 'image.jpg',
      movie_banner: 'banner.jpg',
    };

    const movie = mapGhibliMovieToMovie(film);

    expect(movie.original_title).toBe('Spirited Away');
    expect(movie.tagline).toBe('Sen to Chihiro no Kamikakushi');
    expect(movie.runtime).toBe(125);
    expect(movie.vote_average).toBe(97);
    expect(movie.genres?.[0].name).toBe('Ghibli');
  });

  it('maps StaticJson movie to Movie with release_date, genres, casts, and tagline', () => {
    const raw: StaticJsonMovie = {
      id: 'static-1',
      title: 'Casablanca',
      year: 1942,
      plot: 'A cynical expatriate American cafe owner...',
      poster: 'https://example.com/poster.jpg',
      genres: ['Drama', 'Romance', 'War'],
      director: 'Michael Curtiz',
      actors: 'Humphrey Bogart, Ingrid Bergman, Paul Henreid',
      tagline: 'They had a date with fate in Casablanca!',
      runtime: 102,
      rating: 8.5,
      release_date: '1942-11-26',
      language: 'en',
    };

    const movie = mapStaticJsonMovieToMovie(raw);

    expect(movie.original_title).toBe('Casablanca');
    expect(movie.overview).toBe('A cynical expatriate American cafe owner...');
    expect(movie.release_date).toBe('1942-11-26');
    expect(movie.vote_average).toBe(8.5);
    expect(movie.runtime).toBe(102);
    expect(movie.poster_path).toBe('https://example.com/poster.jpg');
    expect(movie.genres).toHaveLength(3);
    expect(movie.genres?.[0].name).toBe('Drama');
    expect(movie.tagline).toContain('They had a date with fate');
    expect(movie.casts).toHaveLength(3);
    expect(movie.casts?.[0].name).toBe('Humphrey Bogart');
    expect(movie.original_language).toBe('en');
  });
});

