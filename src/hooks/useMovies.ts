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

// Exportar apenas o hook e o contexto (Provider será definido em arquivo .tsx)
export { MoviesContext };

// Lógica interna (Custom Hook Pattern)
const useMoviesLogic = () => {
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const ITEMS_PER_PAGE = 20;

    // Buscar todas as páginas na montagem
    useEffect(() => {
      const loadAllMovies = async () => {
        setLoading(true);
        try {
          const movies = await fetchAllMovies();
          setAllMovies(movies);
          setDisplayedMovies(movies.slice(0, ITEMS_PER_PAGE)); // Paginação inicial
        } catch (error) {
          console.error('Error loading movies:', error);
        } finally {
          setLoading(false);
        }
      };
      loadAllMovies();
    }, []);

    // Atualizar displayedMovies quando searchQuery muda
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

    // Função de busca
    const searchMovies = (query: string) => {
      setSearchQuery(query);
    };

    // Função para carregar mais filmes (paginação)
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

    // Verificar se há mais filmes para carregar
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

// Função original mantida para compatibilidade (pode ser removida depois da refatoração)
export const useMovies = () => {
    return useMoviesLogic();
  };