import useSWR from "swr";
import {
  getPopularMovies,
  getNowPlayingMovies,
  searchMovies,
  getMoviesByGenre,
  getMovieDetails,
  getMovieVideos,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/lib/api";
import { Movie, MoviesResponse, Video } from "@/types/index";

const ensureValidPage = (page: number | string): number => {
  const parsedPage = parseInt(String(page), 10);
  if (isNaN(parsedPage) || parsedPage < 1) return 1;
  return Math.min(parsedPage, 500);
};

type FetchFunction = (page: number) => Promise<MoviesResponse>;

type UseMoviesResult = {
  movies: Movie[] | undefined;
  totalPages: number | undefined;
  isLoading: boolean;
  isError: Error | undefined;
};

const createMovieHook =
  (key: string, fetchFn: FetchFunction) =>
  (page = 1): UseMoviesResult => {
    const validPage = ensureValidPage(page);

    const { data, error, isLoading } = useSWR(`/${key}/${validPage}`, () =>
      fetchFn(validPage)
    );

    return {
      movies: data?.results,
      totalPages: data?.total_pages,
      isLoading,
      isError: error,
    };
  };

export const usePopularMovies = createMovieHook(
  "movie/popular",
  getPopularMovies
);
export const useNowPlayingMovies = createMovieHook(
  "movie/now_playing",
  getNowPlayingMovies
);
export const useTopRatedMovies = createMovieHook(
  "movie/top_rated",
  getTopRatedMovies
);
export const useUpcomingMovies = createMovieHook(
  "movie/upcoming",
  getUpcomingMovies
);

export function useMovieSearch(query: string, page = 1): UseMoviesResult {
  const validPage = ensureValidPage(page);

  const { data, error, isLoading } = useSWR(
    query ? `/search/movie/${query}/${validPage}` : null,
    () => searchMovies(query, validPage)
  );

  return {
    movies: data?.results,
    totalPages: data?.total_pages,
    isLoading,
    isError: error,
  };
}

export function useMoviesByGenre(
  genreIds: number[],
  page = 1
): UseMoviesResult {
  const validPage = ensureValidPage(page);

  const validGenreIds = Array.isArray(genreIds)
    ? genreIds.filter((id) => !isNaN(Number(id)))
    : [];
  const genreKey = validGenreIds?.length
    ? validGenreIds.sort().join("-")
    : null;

  const { data, error, isLoading } = useSWR(
    genreKey ? `/genre/${genreKey}/${validPage}` : null,
    () => getMoviesByGenre(validGenreIds, validPage)
  );

  return {
    movies: data?.results || [],
    totalPages: data?.total_pages || 0,
    isLoading,
    isError: error,
  };
}

type MovieDetailsResult = {
  movie: Movie | undefined;
  isLoading: boolean;
  isError: Error | undefined;
};

export function useMovieDetails(movieId: number): MovieDetailsResult {
  const { data, error, isLoading } = useSWR(
    movieId ? `/movie/${movieId}` : null,
    () => getMovieDetails(movieId)
  );

  return {
    movie: data,
    isLoading,
    isError: error,
  };
}

type MovieVideosResult = {
  videos: Video[] | undefined;
  isLoading: boolean;
  isError: Error | undefined;
};

export function useMovieVideos(movieId: number): MovieVideosResult {
  const { data, error, isLoading } = useSWR(
    movieId ? `/movie/${movieId}/videos` : null,
    () => getMovieVideos(movieId)
  );

  return {
    videos: data?.results,
    isLoading,
    isError: error,
  };
}
