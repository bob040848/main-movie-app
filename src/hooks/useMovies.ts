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

const createMovieHook =
  (key: any, fetchFn: any) =>
  (page = 1) => {
    const { data, error, isLoading } = useSWR(`/${key}/${page}`, () =>
      fetchFn(page)
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
  const { data, error, isLoading } = useSWR(
    query ? `/search/movie/${query}/${page}` : null,
    () => searchMovies(query, page)
  );

  return {
    movies: data?.results,
    totalPages: data?.total_pages,
    isLoading,
    isError: error,
  };
}

// hooks/useMovies.ts
export function useMoviesByGenre(genreIds: number[], page = 1) {
  const genreKey = genreIds?.length ? genreIds.sort().join("-") : null;

  const { data, error, isLoading } = useSWR(
    genreKey ? `/genre/${genreKey}/${page}` : null,
    () => getMoviesByGenre(genreIds, page)
  );

  // Debugging logs
  if (data)
    console.log(`Raw API data for genre ${genreKey}, page ${page}:`, data);
  if (error) console.log(`Error fetching movies for genre ${genreKey}:`, error);

  return {
    movies: data?.results || [], // Fallback to empty array
    totalPages: data?.total_pages || 0, // Fallback to 0
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
