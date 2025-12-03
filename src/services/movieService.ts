import type { Movie, PaginatedResponse } from '../types';

export const fetchAllMovies = async (): Promise<Movie[]> => {
    let allMovies: Movie[] = [];
    let page = 1;
    let hasMore = true;

    console.log('Starting to fetch movies...');

    while (hasMore && page <= 5) { // Limitar a 5 páginas para evitar loop infinito
      try {
        console.log(`Fetching page ${page}...`);
        const response = await fetch(
          `https://jsonfakery.com/movies/paginated?page=${page}`
        );

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
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
        hasMore = false;
      }
    }

    console.log(`Fetched ${allMovies.length} movies total`);
    return allMovies;
  };