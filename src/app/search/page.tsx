"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMovieSearch } from "@/hooks/useMovies";
import MovieCard from "@/components/common/MovieCard";
import MovieCardSkeleton from "@/components/common/MovieCardSkeleton";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);

  const { movies, totalPages, isLoading } = useMovieSearch(query, page);

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Search Results: &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground">
          {movies?.length
            ? `Found ${movies.length} results`
            : isLoading
            ? "Searching..."
            : "No movies found"}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isLoading
          ? Array(20)
              .fill(0)
              .map((_, i) => <MovieCardSkeleton key={i} />)
          : movies?.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
      </div>

      {totalPages && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <div className="flex items-center">
            <span className="px-3">
              Page {page} of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages || 1))}
            disabled={page === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
