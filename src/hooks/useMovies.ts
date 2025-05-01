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

// Helper to ensure page is a valid number
const ensureValidPage = (page: any): number => {
  const parsedPage = parseInt(page, 10);
  if (isNaN(parsedPage) || parsedPage < 1) return 1;
  return Math.min(parsedPage, 500); // TMDb API has 500 page max
};

const createMovieHook =
  (key: any, fetchFn: any) =>
  (page = 1) => {
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

export function useMovieSearch(query: string, page = 1) {
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

export function useMoviesByGenre(genreIds: number[], page = 1) {
  const validPage = ensureValidPage(page);

  // Validate genreIds to ensure it's a valid array
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

export function useMovieDetails(movieId: number) {
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

export function useMovieVideos(movieId: number) {
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
