import { useCallback, useEffect } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  hasMore: boolean;
  loading: boolean;
  enabled?: boolean;
}

export const useInfiniteScroll = (
  onReachBottom: () => void,
  { threshold = 200, hasMore, loading, enabled = true }: UseInfiniteScrollOptions
) => {
  const handleScroll = useCallback(() => {
    if (!enabled || loading || !hasMore) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - threshold) {
      onReachBottom();
    }
  }, [enabled, loading, hasMore, threshold, onReachBottom]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
};

