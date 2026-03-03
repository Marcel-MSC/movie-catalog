/**
 * Interface for static JSON movie datasets (e.g. from GitHub raw URLs or public folder).
 * Flexible structure to support common field names across different static sources.
 */
export interface StaticJsonMovie {
  id?: string | number;
  title: string;
  year?: number | string;
  plot?: string;
  overview?: string;
  description?: string;
  poster?: string;
  poster_path?: string;
  image?: string;
  posterURL?: string;
  genres?: string[] | Array<{ id?: number; name: string }>;
  director?: string;
  cast?: string[];
  actors?: string;
  tagline?: string;
  runtime?: number | string;
  rating?: number;
  vote_average?: number;
  release_date?: string;
  language?: string;
  original_language?: string;
}
