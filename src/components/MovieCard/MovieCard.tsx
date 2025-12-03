import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/outline';
import type { Movie } from '../../types';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

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
          observer.disconnect(); // Stop observing after entering viewport
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

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !hasError && !isInView && (
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
      {hasError && (
        <div className={`${className} bg-gray-200 rounded flex items-center justify-center`}>
          <span className="text-gray-400 text-xs">No image</span>
        </div>
      )}
    </div>
  );
};

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpansion = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
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

      {/* Expanded section with smooth animation */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <h4 className="font-semibold mt-4 mb-3 text-gray-800 animate-fade-in">Cast</h4>
          <div className="flex flex-wrap gap-2 animate-fade-in-up">
            {movie.casts?.slice(0, 6).map((cast, index) => (
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
      </div>
    </div>
  );
};