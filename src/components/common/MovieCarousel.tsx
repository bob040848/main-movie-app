"use client";

import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import { Movie } from "@/types/index";
import MovieCardSkeleton from "./MovieCardSkeleton";

type MovieCarouselProps = {
  title: string;
  movies?: Movie[];
  isLoading?: boolean;
};

const ITEMS_PER_PAGE = 6;

export default function MovieCarousel({
  title,
  movies = [],
  isLoading,
}: MovieCarouselProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);

  const totalPages = Math.ceil((movies?.length || 0) / ITEMS_PER_PAGE);

  useEffect(() => {
    if (movies?.length) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setDisplayedMovies(movies.slice(startIndex, endIndex));
    }
  }, [currentPage, movies]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
              aria-label="Previous page"
            >
              &lt;
            </button>
            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
              aria-label="Next page"
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isLoading
          ? Array(ITEMS_PER_PAGE)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="w-full">
                  <MovieCardSkeleton />
                </div>
              ))
          : displayedMovies?.map((movie) => (
              <div key={movie.id} className="w-full">
                <MovieCard movie={movie} />
              </div>
            ))}
      </div>
    </section>
  );
}
