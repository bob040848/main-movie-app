"use client";

import MovieShowcase from "@/components/common/MovieShowcase";
import MovieCarousel from "@/components/common/MovieCarousel";

import {
  usePopularMovies,
  useTopRatedMovies,
  useUpcomingMovies,
} from "@/hooks/useMovies";

export default function HomePage() {
  const { movies: popularMovies, isLoading: isLoadingPopular } =
    usePopularMovies();
  const { movies: topRatedMovies, isLoading: isLoadingTopRated } =
    useTopRatedMovies();
  const { movies: upcomingMovies, isLoading: isLoadingUpcoming } =
    useUpcomingMovies();

  return (
    <main className="container mx-auto px-4 py-8">
      <MovieShowcase />

      <MovieCarousel
        title="Popular Movies"
        movies={popularMovies}
        isLoading={isLoadingPopular}
      />

      <MovieCarousel
        title="Top Rated Movies"
        movies={topRatedMovies}
        isLoading={isLoadingTopRated}
      />

      <MovieCarousel
        title="Upcoming Movies"
        movies={upcomingMovies}
        isLoading={isLoadingUpcoming}
      />
    </main>
  );
}
