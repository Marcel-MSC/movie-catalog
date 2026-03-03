import React, { useState } from 'react';
import { StarIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import type { Movie } from '../../types';
import { useMovieRating } from '../../hooks/useMovieRating';
import { useToast } from '../../contexts/ToastContext';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const FALLBACK_MESSAGE = 'Image not available';

const ImageFallback: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`${className} bg-gray-200 rounded flex flex-col items-center justify-center gap-1 min-w-0`}
    aria-label={FALLBACK_MESSAGE}
  >
    <PhotoIcon className="w-8 h-8 text-gray-400 shrink-0" />
    <span className="text-gray-500 text-xs text-center px-1">{FALLBACK_MESSAGE}</span>
  </div>
);

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const placeholderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const hasNoUrl = !src || !src.trim();
  if (hasNoUrl) return <ImageFallback className={className} />;
  if (hasError) return <ImageFallback className={className} />;

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !isInView && (
        <div
          ref={placeholderRef}
          className="absolute inset-0 bg-gray-200 animate-pulse rounded flex items-center justify-center"
        >
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
        />
      )}
    </div>
  );
};

interface MovieCardProps {
  movie: Movie;
}

const STAR_COUNT = 5;

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const { getRating, setRating } = useMovieRating();
  const { showSuccess } = useToast();

  const handleToggleExpansion = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const nextExpanded = !isExpanded;

    if (nextExpanded) {
      const saved = getRating(movie.id);
      setStars(saved?.stars ?? 0);
      setComment(saved?.comment ?? '');

      // #region agent log
      fetch('http://127.0.0.1:7401/ingest/55f0b64c-a724-4203-9a7d-19a7cde49646', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': 'cd139d',
        },
        body: JSON.stringify({
          sessionId: 'cd139d',
          runId: 'initial',
          hypothesisId: 'H1',
          location: 'MovieCard.tsx:97',
          message: 'movie-card-expanded',
          data: {
            movieId: movie.id,
            stars: saved?.stars ?? 0,
            commentLength: (saved?.comment ?? '').length,
            hasTagline: Boolean(movie.tagline),
            genresCount: Array.isArray(movie.genres) ? movie.genres.length : 0,
            castsCount: Array.isArray(movie.casts) ? movie.casts.length : 0,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    }

    // #region agent log
    fetch('http://127.0.0.1:7401/ingest/55f0b64c-a724-4203-9a7d-19a7cde49646', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': 'cd139d',
      },
      body: JSON.stringify({
        sessionId: 'cd139d',
        runId: 'initial',
        hypothesisId: 'H2',
        location: 'MovieCard.tsx:105',
        message: 'movie-card-toggle',
        data: {
          movieId: movie.id,
          nextExpanded,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    setIsExpanded(nextExpanded);
  };

  const handleSaveRating = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (stars >= 1 && stars <= STAR_COUNT) {
      setRating(movie, stars, comment);
      showSuccess('Saved successfully!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 ease-in-out">
      {/* Basic content */}
      <div className="p-4 cursor-pointer" onClick={handleToggleExpansion}>
        <div className="flex gap-4">
          <LazyImage
            src={movie.poster_path || ''}
            alt={movie.original_title}
            className="w-24 h-36 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
              {movie.original_title}
            </h3>
            <p className="text-gray-500 font-medium">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </p>
            <div className="flex items-center mt-3">
              <StarIcon className="w-5 h-5 text-amber-400" />
              <span className="ml-2 font-semibold text-gray-800">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
            <p className="mt-3 text-gray-600 line-clamp-2 leading-relaxed">{movie.overview}</p>
          </div>
        </div>
      </div>

      {/* Expanded section with smooth animation and internal scroll when needed */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isExpanded
            ? 'max-h-[28rem] opacity-100 overflow-y-auto'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 pb-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 space-y-4">
          {/* Tagline / special line */}
          {movie.tagline && (
            <p className="pt-4 text-sm text-gray-700 italic animate-fade-in">
              {movie.tagline}
            </p>
          )}

          {/* Meta information: year, runtime, language */}
          {(movie.release_date || movie.runtime || movie.original_language) && (
            <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1 animate-fade-in">
              {movie.release_date && (
                <span>
                  Year:{' '}
                  <span className="font-semibold">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </span>
              )}
              {movie.runtime && (
                <span>
                  Runtime:{' '}
                  <span className="font-semibold">{movie.runtime} min</span>
                </span>
              )}
              {movie.original_language && (
                <span>
                  Language:{' '}
                  <span className="font-semibold">
                    {movie.original_language.toUpperCase()}
                  </span>
                </span>
              )}
            </div>
          )}

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2 animate-fade-in">
                Genres
              </h4>
              <div className="flex flex-wrap gap-2 animate-fade-in-up">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-white/80 border border-blue-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700 hover:bg-blue-50 transition"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Extended overview */}
          {movie.overview && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-1 animate-fade-in">
                Overview
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed animate-fade-in-up">
                {movie.overview}
              </p>
            </div>
          )}

          {/* Cast */}
          {movie.casts && movie.casts.length > 0 && (
            <div>
              <h4 className="font-semibold mt-2 mb-3 text-gray-800 animate-fade-in">
                Cast
              </h4>
              <div className="flex flex-wrap gap-2 animate-fade-in-up">
                {movie.casts.slice(0, 6).map((cast, index) => (
                  <span
                    key={cast.id}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 px-3 py-2 rounded-full text-sm font-medium text-gray-700 transition-all duration-200 transform hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {cast.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Your rating */}
          <div className="border-t border-gray-200 pt-4 animate-fade-in">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Your rating
            </h4>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStars(value);
                  }}
                  className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1"
                  aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
                  aria-pressed={stars === value}
                >
                  {stars >= value ? (
                    <StarIconSolid className="w-7 h-7 text-amber-500" aria-hidden />
                  ) : (
                    <StarIcon className="w-7 h-7 text-amber-400" aria-hidden />
                  )}
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Add a comment (optional)"
              className="w-full text-sm border border-gray-200 rounded-lg p-2 resize-y min-h-[4rem] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              aria-label="Add a comment (optional)"
              rows={2}
            />
            <button
              type="button"
              onClick={handleSaveRating}
              disabled={stars < 1 || stars > STAR_COUNT}
              className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};