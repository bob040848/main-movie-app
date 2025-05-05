//src/app/search/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMovieSearch } from "@/hooks/useMovies";
import MovieCard from "@/components/common/MovieCard";
import MovieCardSkeleton from "@/components/common/MovieCardSkeleton";
import GenreList from "@/components/common/GenreList";
import Pagination from "@/components/common/Pagination";
import { useGenres } from "@/hooks/useGenres";
import { Movie } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState<number>(1);
  const router = useRouter();

  const { movies, totalPages, isLoading } = useMovieSearch(query, page);
  const { genres } = useGenres();

  useEffect(() => {
    setPage(1);
  }, [query]);

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Search Movies</h1>
          <p className="text-muted-foreground">
            Enter a search term to find movies
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Search results</h1>
            <p className="text-muted-foreground">
              {movies?.length
                ? `${movies.length} results for "${query}"`
                : isLoading
                ? "Searching..."
                : `0 results for "${query}"`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(12)
                .fill(0)
                .map((_, i) => (
                  <MovieCardSkeleton key={i} />
                ))}
            </div>
          ) : movies?.length === 0 ? (
            <div className="border rounded-lg p-8 text-center">
              <p className="mb-2">No results found.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search or check out movies by genre.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {movies?.map((movie: Movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages || 0}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>

        <div className="border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6 dark:border-neutral-800 order-first lg:order-last">
          <GenreList title="Search by genre" columns={2} showSearch={true} />
        </div>
      </div>
    </div>
  );
}
