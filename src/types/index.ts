export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  status?: string;
  tagline?: string;
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  similar?: {
    results: Movie[];
  };
  recommendations?: {
    results: Movie[];
  };
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface GenresResponse {
  genres: Genre[];
}
