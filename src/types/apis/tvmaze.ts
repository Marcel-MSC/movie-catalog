export interface TvmazeShow {
  id: number;
  name: string;
  summary?: string | null;
  premiered?: string | null;
  rating?: {
    average?: number | null;
  };
  image?: {
    medium?: string | null;
    original?: string | null;
  };
  language?: string;
  genres?: string[];
}

export interface TvmazeShowSearchResult {
  score: number;
  show: TvmazeShow;
}

