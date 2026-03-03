import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from './hooks/useMovies';
import { useDebounce } from './hooks/useDebounce';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { SearchBar } from './components/SearchBar';
import { MovieCard } from './components/MovieCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import type { DataSource } from './types';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { logout } from './store/authSlice';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dataSource, setDataSource] = useState<DataSource>('tvmaze');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { movies, searchMovies, loadMoreMovies, loading, hasMore, error } = useMovies(dataSource);
  const [loadingMore, setLoadingMore] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);

  // Aplicar busca quando o valor debounced mudar
  useEffect(() => {
    searchMovies(debouncedSearchQuery);
  }, [debouncedSearchQuery, searchMovies]);

  // Infinite scroll based on window scroll position
  useInfiniteScroll(
    () => {
      setLoadingMore(true);
      loadMoreMovies();
      setLoadingMore(false);
    },
    {
      threshold: 200,
      hasMore,
      loading: loading || loadingMore,
    }
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Movie Catalog
            </h1>
            <p className="text-gray-700 text-lg font-medium">Discover and explore amazing movies</p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-3">
            {currentUser ? (
              <>
                <span className="text-sm text-gray-700">
                  Logged in as{' '}
                  <span className="font-semibold">{currentUser.email}</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/my-ratings')}
                  className="px-3 py-1.5 rounded-full text-sm font-medium border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 transition"
                >
                  My ratings
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  className="px-3 py-1.5 rounded-full text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/signin')}
                  className="px-3 py-1.5 rounded-full text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDataSource('tvmaze')}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                dataSource === 'tvmaze'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              TVMaze (Shows)
            </button>
            <button
              type="button"
              onClick={() => setDataSource('sampleapis')}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                dataSource === 'sampleapis'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              SampleAPIs (Movies)
            </button>
            <button
              type="button"
              onClick={() => setDataSource('ghibli')}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                dataSource === 'ghibli'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Studio Ghibli
            </button>
            <button
              type="button"
              onClick={() => setDataSource('staticjson')}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                dataSource === 'staticjson'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Classics (Static)
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-500">
            Data source:{' '}
            <span className="font-semibold">
              {dataSource === 'tvmaze' && 'TVMaze (series catalog)'}
              {dataSource === 'sampleapis' && 'SampleAPIs (movies collections)'}
              {dataSource === 'ghibli' && 'Studio Ghibli films'}
              {dataSource === 'staticjson' && 'Classic films (static JSON)'}
            </span>
          </p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 items-start">
          {loading ? (
            // Show skeletons while loading
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))
          ) : (
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          )}
          {loadingMore && (
            // Show skeletons while loading more
            Array.from({ length: 3 }).map((_, index) => (
              <LoadingSkeleton key={`loading-${index}`} />
            ))
          )}
        </div>

        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg font-semibold">
              Something went wrong while loading movies.
            </p>
            <p className="text-gray-500 mt-2">{error}</p>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No movies found matching your search.' : 'No movies available.'}
            </p>
          </div>
        )}
      </div>
      </div>
    </ToastProvider>
  );
}

export default App
