import type { Movie, PaginatedResponse } from '../types';
// Import fallback data - now contains full API response structure
import fallbackResponse from '../data/movies.json';

// Set to true to test fallback functionality
const FORCE_FALLBACK = false;

export const fetchAllMovies = async (): Promise<Movie[]> => {
    let allMovies: Movie[] = [];
    let page = 1;
    let hasMore = true;
    let apiFailed = false;

    console.log('Starting to fetch movies...');

    while (hasMore && page <= 5) { // Limitar a 5 páginas para evitar loop infinito
      try {
        console.log(`Fetching page ${page}...`);

        // Force fallback for testing purposes
        const apiUrl = FORCE_FALLBACK
          ? `https://invalid-api-url-for-testing-fallback-${Date.now()}.com`
          : `https://jsonfakery.com/movies/paginated?page=${page}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          apiFailed = true;
          hasMore = false;
          break;
        }

        const data: PaginatedResponse = await response.json();
        console.log(`Page ${page} response:`, data);

        if (data && data.data && data.data.length > 0) {
          allMovies = [...allMovies, ...data.data];
          page++;

          // Verificar se chegou à última página
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

    // Fallback: usar dados locais se a API falhar completamente
    if (apiFailed && allMovies.length === 0) {
      console.log('API failed, using fallback data from local JSON...');
      const fallbackData = fallbackResponse as unknown as PaginatedResponse;
      allMovies = fallbackData.data || [];
      console.log(`Loaded ${allMovies.length} movies from local fallback`);
    }

    console.log(`Total movies available: ${allMovies.length}`);
    return allMovies;
  };