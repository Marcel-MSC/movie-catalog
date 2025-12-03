import { useState, useEffect, useCallback } from 'react';
import { useMovies } from './hooks/useMovies';
import { useDebounce } from './hooks/useDebounce';
import { SearchBar } from './components/SearchBar';
import { MovieCard } from './components/MovieCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { movies, searchMovies, loadMoreMovies, loading, hasMore } = useMovies();
  const [loadingMore, setLoadingMore] = useState(false);

  // Aplicar busca quando o valor debounced mudar
  useEffect(() => {
    searchMovies(debouncedSearchQuery);
  }, [debouncedSearchQuery, searchMovies]);

  // Função para detectar scroll próximo ao fim da página
  const handleScroll = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Se estiver a 200px do fim da página
    if (scrollTop + windowHeight >= documentHeight - 200) {
      setLoadingMore(true);
      loadMoreMovies();
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, loadMoreMovies]);

  // Adicionar listener de scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Movie Catalog
          </h1>
          <p className="text-gray-700 text-lg font-medium">Discover and explore amazing movies</p>
        </header>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
          {loading ? (
            // Mostrar skeletons enquanto carrega
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))
          ) : (
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          )}
          {loadingMore && (
            // Mostrar skeletons enquanto carrega mais
            Array.from({ length: 3 }).map((_, index) => (
              <LoadingSkeleton key={`loading-${index}`} />
            ))
          )}
        </div>

        {!loading && movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No movies found matching your search.' : 'No movies available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
