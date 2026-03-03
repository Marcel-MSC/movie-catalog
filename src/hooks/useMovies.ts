import { useState, useEffect, useMemo } from 'react';
import type { DataSource, Movie } from '../types';
import { fetchAllMovies } from '../services/movieService';

const useMoviesLogic = (source: DataSource) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 20;

  const filteredMovies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return allMovies;
    }

    return allMovies.filter((movie) =>
      movie.original_title.toLowerCase().includes(query)
    );
  }, [allMovies, searchQuery]);

  // Fetch all movies when source changes
  useEffect(() => {
    const loadAllMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const movies = await fetchAllMovies(source);
        setAllMovies(movies);
        setDisplayedMovies(movies.slice(0, ITEMS_PER_PAGE)); // Initial pagination
      } catch (error) {
        console.error('Error loading movies:', error);
        setError('Failed to load movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadAllMovies();
  }, [source]);

  // Update displayedMovies when the filtered list changes
  useEffect(() => {
    setDisplayedMovies(filteredMovies.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [filteredMovies]);

  // Search function
  const searchMovies = (query: string) => {
    setSearchQuery(query);
  };

  // Function to load more movies (pagination)
  const loadMoreMovies = () => {
    const nextPage = currentPage + 1;
    const startIndex = currentPage * ITEMS_PER_PAGE;

    const newMovies = filteredMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (newMovies.length > 0) {
      setDisplayedMovies(prev => [...prev, ...newMovies]);
      setCurrentPage(nextPage);
    }
  };

  // Check if there are more movies to load
  const hasMore = displayedMovies.length < filteredMovies.length;

  return { movies: displayedMovies, searchMovies, loadMoreMovies, loading, hasMore, error };
};

export const useMovies = (source: DataSource) => {
  return useMoviesLogic(source);
};