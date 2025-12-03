export interface Movie {
  id: string;
  movie_id: number;
  original_title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  // Outros campos que podem estar na resposta
  casts?: Array<{
    id: string;
    name: string;
    character?: string;
  }>;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  runtime?: number;
  tagline?: string;
  status?: string;
  backdrop_path?: string;
  popularity?: number;
  vote_count?: number;
  original_language?: string;
  video?: boolean;
  adult?: boolean;
}

export interface PaginatedResponse {
  current_page: number;
  data: Movie[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}