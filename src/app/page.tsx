"use client";

import { useState } from "react";
import MovieShowcase from "@/components/common/MovieShowcase";
import MovieCarousel from "@/components/common/MovieCarousel";
import Pagination from "@/components/common/Pagination";

import {
  usePopularMovies,
  useTopRatedMovies,
  useUpcomingMovies,
} from "@/hooks/useMovies";

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    movies: popularMovies,
    totalPages: popularTotalPages,
    isLoading: isLoadingPopular,
  } = usePopularMovies(currentPage);
  const { movies: topRatedMovies, isLoading: isLoadingTopRated } =
    useTopRatedMovies(currentPage);
  const { movies: upcomingMovies, isLoading: isLoadingUpcoming } =
    useUpcomingMovies(currentPage);

  const totalPages = popularTotalPages || 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isLoading = isLoadingPopular || isLoadingTopRated || isLoadingUpcoming;

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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        className="mt-12 mb-8"
      />
    </main>
  );
}
