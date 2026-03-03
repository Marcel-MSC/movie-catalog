import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAppSelector } from '../store/hooks';
import { useMovieRating } from '../hooks/useMovieRating';

type ViewMode = 'grid' | 'table';

export const MyRatings = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { allRatings } = useMovieRating();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            My ratings
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to see your rated movies.
          </p>
          <Link
            to="/signin"
            className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const rows = useMemo(
    () =>
      Object.entries(allRatings)
        .map(([movieId, rating]) => ({
          movieId,
          ...rating,
        }))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [allRatings],
  );

  const hasRatings = rows.length > 0;

  const renderStars = (stars: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIconSolid
          key={index}
          className={`w-4 h-4 ${
            index < stars ? 'text-amber-400' : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-600">{stars}/5</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Movie Catalog
            </h1>
            <p className="text-gray-700 text-lg font-medium">
              My ratings and comments
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-full text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
            >
              Back to catalog
            </button>
          </div>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-semibold">
              {rows.length} {rows.length === 1 ? 'movie' : 'movies'}
            </span>{' '}
            rated by{' '}
            <span className="font-semibold">{currentUser.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-500">View as:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border transition ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {!hasRatings && (
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-xl bg-white/80 backdrop-blur rounded-2xl shadow-md border border-gray-100 px-6 py-10 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                You haven&apos;t rated any movies yet
              </h2>
              <p className="text-gray-600 mb-6">
                Browse the catalog and open a movie card to leave your rating
                and comment.
              </p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Start exploring
              </button>
            </div>
          </div>
        )}

        {hasRatings && viewMode === 'grid' && (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {rows.map((item) => (
              <div
                key={item.movieId}
                className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 p-4 flex gap-4 transition-shadow"
              >
                <div className="w-20 h-28 rounded overflow-hidden bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                  {item.moviePosterPath ? (
                    <img
                      src={item.moviePosterPath}
                      alt={item.movieTitle ?? 'Poster'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>No poster</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {item.movieTitle ?? 'Title unavailable'}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    {item.movieReleaseYear ?? 'Year unknown'}
                  </p>
                  {renderStars(item.stars)}
                  {item.comment && (
                    <p className="mt-2 text-xs text-gray-700 line-clamp-3">
                      {item.comment}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-gray-400">
                    Updated at {new Date(item.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasRatings && viewMode === 'table' && (
          <div className="mt-4 overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poster
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Your rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated at
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {rows.map((item) => (
                  <tr key={item.movieId}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="w-14 h-20 rounded overflow-hidden bg-gray-200 flex items-center justify-center text-[11px] text-gray-500">
                        {item.moviePosterPath ? (
                          <img
                            src={item.moviePosterPath}
                            alt={item.movieTitle ?? 'Poster'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>No poster</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.movieTitle ?? 'Title unavailable'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.movieReleaseYear ?? 'Year unknown'}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        ID: {item.movieId}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {renderStars(item.stars)}
                    </td>
                    <td className="px-4 py-3 align-top max-w-xs">
                      <p className="text-xs text-gray-700 line-clamp-3">
                        {item.comment || 'No comment'}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-gray-500 whitespace-nowrap">
                      {new Date(item.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

