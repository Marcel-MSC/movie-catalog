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

    while (hasMore && page <= 5) { // Limit to 5 pages to avoid infinite loop
      try {

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

        if (data && data.data && data.data.length > 0) {
          allMovies = [...allMovies, ...data.data];
          page++;

          // Check if reached the last page
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

    // Fallback: use local data if the API fails completely
    if (apiFailed && allMovies.length === 0) {
      const fallbackData = fallbackResponse as unknown as PaginatedResponse;
      allMovies = fallbackData.data || [];
    }
    return allMovies;
  };