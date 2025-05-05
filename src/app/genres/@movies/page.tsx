//src/app/genres/@movies/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMoviesByGenre } from "@/hooks/useMovies";
import MovieCard from "@/components/common/MovieCard";
import MovieCardSkeleton from "@/components/common/MovieCardSkeleton";
import Pagination from "@/components/common/Pagination";
import { Movie } from "@/types";

export default function GenreMoviesPage() {
  const searchParams = useSearchParams();
  const genreId = searchParams.get("id");
  const genreName = searchParams.get("name");
  const [page, setPage] = useState<number>(1);

  const { movies, totalPages, isLoading } = useMoviesByGenre(
    genreId ? [parseInt(genreId)] : [],
    page
  );

  useEffect(() => {
    setPage(1);
  }, [genreId]);

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          : movies?.map((movie: Movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
      </div>

      {!isLoading && movies?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No movies found in this genre</p>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages || 0}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
