import { useState, useEffect, createContext } from 'react';
import type { Movie } from '../types';
import { fetchAllMovies } from '../services/movieService';

// Context API Pattern - Movies Context
interface MoviesContextType {
  movies: Movie[];
  searchMovies: (query: string) => void;
  loadMoreMovies: () => void;
  loading: boolean;
  hasMore: boolean;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

// Export only the hook and context
export { MoviesContext };

// Internal logic (Custom Hook Pattern)
const useMoviesLogic = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 20;

  // Fetch all pages on mount
  useEffect(() => {
    const loadAllMovies = async () => {
      setLoading(true);
      try {
        const movies = await fetchAllMovies();
        setAllMovies(movies);
        setDisplayedMovies(movies.slice(0, ITEMS_PER_PAGE)); // Initial pagination
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAllMovies();
  }, []);

  // Update displayedMovies when searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDisplayedMovies(allMovies.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
    } else {
      const filtered = allMovies.filter(movie =>
        movie.original_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedMovies(filtered.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
    }
  }, [searchQuery, allMovies]);

  // Search function
  const searchMovies = (query: string) => {
    setSearchQuery(query);
  };

  // Function to load more movies (pagination)
  const loadMoreMovies = () => {
    const nextPage = currentPage + 1;
    const startIndex = currentPage * ITEMS_PER_PAGE;

    let sourceMovies = allMovies;
    if (searchQuery.trim()) {
      sourceMovies = allMovies.filter(movie =>
        movie.original_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const newMovies = sourceMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (newMovies.length > 0) {
      setDisplayedMovies(prev => [...prev, ...newMovies]);
      setCurrentPage(nextPage);
    }
  };

  // Check if there are more movies to load
  const hasMore = (() => {
    if (searchQuery.trim()) {
      const filtered = allMovies.filter(movie =>
        movie.original_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return displayedMovies.length < filtered.length;
    }
    return displayedMovies.length < allMovies.length;
  })();

  return { movies: displayedMovies, searchMovies, loadMoreMovies, loading, hasMore };
};

export const useMovies = () => {
  return useMoviesLogic();
};