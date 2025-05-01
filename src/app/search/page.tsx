"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMovieSearch } from "@/hooks/useMovies";
import MovieCard from "@/components/common/MovieCard";
import MovieCardSkeleton from "@/components/common/MovieCardSkeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GenreList from "@/components/common/GenreList";
import { useGenres } from "@/hooks/useGenres";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { movies, totalPages, isLoading } = useMovieSearch(query, page);
  const { genres } = useGenres();

  useEffect(() => {
    setPage(1);
  }, [query]);

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
              {movies?.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}

          {totalPages && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <Button
                      key={i}
                      variant={page === pageNumber ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0 mx-1"
                      onClick={() => setPage(pageNumber)}
                      disabled={isLoading}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                {totalPages > 7 && (
                  <>
                    <span className="px-1">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setPage(totalPages)}
                      disabled={isLoading}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages || 1))}
                disabled={page === totalPages || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        <div className="border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6 dark:border-neutral-800 order-first lg:order-last">
          <GenreList title="Search by genre" columns={2} showSearch={true} />
        </div>
      </div>
    </div>
  );
}
