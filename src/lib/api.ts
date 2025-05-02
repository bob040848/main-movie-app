import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

const validatePage = (page: number): number => {
  if (isNaN(Number(page)) || page < 1) {
    return 1;
  }
  return Math.min(Math.floor(page), 500);
};

const fetchMovies = async (endpoint: string, page = 1) => {
  try {
    const validPage = validatePage(page);
    const response = await tmdbApi.get(endpoint, {
      params: { page: validPage },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

export const getPopularMovies = (page = 1) =>
  fetchMovies("/movie/popular", page);

export const getNowPlayingMovies = (page = 1) =>
  fetchMovies("/movie/now_playing", page);

export const getTopRatedMovies = (page = 1) =>
  fetchMovies("/movie/top_rated", page);

export const getUpcomingMovies = (page = 1) =>
  fetchMovies("/movie/upcoming", page);

export const searchMovies = async (query: string, page = 1) => {
  try {
    const validPage = validatePage(page);
    const response = await tmdbApi.get("/search/movie", {
      params: {
        query,
        page: validPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMoviesByGenre = async (genreIds: number[], page = 1) => {
  try {
    const validPage = validatePage(page);

    if (!genreIds || !Array.isArray(genreIds) || genreIds.length === 0) {
      throw new Error("Invalid genre IDs provided");
    }

    const response = await tmdbApi.get("/discover/movie", {
      params: {
        page: validPage,
        with_genres: genreIds.join(","),
        sort_by: "popularity.desc",
        region: "US",
        "primary_release_date.gte": "1980-01-01",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching movies for genres ${genreIds?.join(",") || "unknown"}:`,
      error.response?.data?.status_message || error.message
    );
    throw error;
  }
};

export const getMovieDetails = async (movieId: number) => {
  try {
    if (!movieId || isNaN(Number(movieId))) {
      throw new Error("Invalid movie ID");
    }

    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "credits,similar,recommendations",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const getMovieVideos = async (movieId: number) => {
  try {
    if (!movieId || isNaN(Number(movieId))) {
      throw new Error("Invalid movie ID");
    }

    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const response = await tmdbApi.get("/genre/movie/list");
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};
export async function getMovieCredits(movieId: number) {
  const url = `${API_BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch movie credits");
  }

  return response.json();
}
