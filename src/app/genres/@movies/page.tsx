"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMoviesByGenre } from "@/hooks/useMovies";
import MovieCard from "@/components/common/MovieCard";
import MovieCardSkeleton from "@/components/common/MovieCardSkeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GenreMoviesPage() {
  const searchParams = useSearchParams();
  const genreId = searchParams.get("id");
  const genreName = searchParams.get("name");
  const [page, setPage] = useState(1);

  const { movies, totalPages, isLoading } = useMoviesByGenre(
    genreId ? [parseInt(genreId)] : [],
    page
  );

  useEffect(() => {
    setPage(1);
  }, [genreId]);

  if (!genreId) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Select a genre to view movies
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          {genreName
            ? `${movies?.length || 0} titles in "${genreName}"`
            : "Movies"}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array(8)
              .fill(0)
              .map((_, i) => <MovieCardSkeleton key={i} />)
          : movies?.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
      </div>

      {!isLoading && movies?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No movies found in this genre</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <Button
                  key={i}
                  variant={page === pageNumber ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setPage(pageNumber)}
                  disabled={isLoading}
                >
                  {pageNumber}
                </Button>
              );
            })}
            {totalPages > 5 && (
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
  );
}
