import type { DataSource, Movie, PaginatedResponse } from '../types';
import fallbackResponse from '../data/movies.json';
import { fetchAllMoviesFromTvmaze } from './tvmazeService';
import { fetchAllMoviesFromSampleApis } from './sampleApisService';
import { fetchAllMoviesFromGhibli } from './ghibliService';
import { fetchAllMoviesFromStaticJson } from './staticJsonService';

// Set to true to test fallback functionality (see README section \"Como Testar o Sistema de Fallback\")
const FORCE_FALLBACK = false;

export const fetchAllMovies = async (
  source: DataSource = 'tvmaze'
): Promise<Movie[]> => {
  // Allow forcing fallback regardless of selected source (for testing)
  if (FORCE_FALLBACK) {
    const fallbackData = fallbackResponse as PaginatedResponse;
    return fallbackData.data || [];
  }

  try {
    switch (source) {
      case 'tvmaze':
        return await fetchAllMoviesFromTvmaze();
      case 'sampleapis':
        return await fetchAllMoviesFromSampleApis();
      case 'ghibli':
        return await fetchAllMoviesFromGhibli();
      case 'staticjson':
        return await fetchAllMoviesFromStaticJson();
      case 'jsonfakery': {
        // Legacy support for the original jsonfakery API + fallback
        let allMovies: Movie[] = [];
        let page = 1;
        let hasMore = true;
        let apiFailed = false;
        const MAX_PAGES = 5;

        while (hasMore && page <= MAX_PAGES) {
          try {
            const apiUrl = `https://jsonfakery.com/movies/paginated?page=${page}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
              console.error(`HTTP error! status: ${response.status}`);
              apiFailed = true;
              hasMore = false;
              break;
            }

            const data: PaginatedResponse = await response.json();

            if (data && data.data && data.data.length > 0) {
              allMovies = [...allMovies, ...data.data];
              page++;

              if (page > data.last_page) {
                hasMore = false;
              }
            } else {
              hasMore = false;
            }
          } catch (error) {
            console.error('Error fetching page:', page, error);
            apiFailed = true;
            hasMore = false;
          }
        }

        if (apiFailed && allMovies.length === 0) {
          console.log('API failed, using fallback data...');
          const fallbackData = fallbackResponse as PaginatedResponse;
          allMovies = fallbackData.data || [];
        }

        return allMovies;
      }
      default: {
        const fallbackData = fallbackResponse as PaginatedResponse;
        return fallbackData.data || [];
      }
    }
  } catch (error) {
    console.error('Error fetching movies from source:', source, error);
    const fallbackData = fallbackResponse as PaginatedResponse;
    return fallbackData.data || [];
  }
};