"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMovieDetails } from "@/hooks/useMovies";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import MovieCardSkeleton from "@/components/common/MovieCardSkeleton";
import { Movie } from "@/types";
import { Suspense } from "react";

export default function SimilarMoviesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = parseInt(searchParams.get("id") || "0", 10);
  const { movie, isLoading } = useMovieDetails(movieId);
  const sortBy = "popularity.desc";

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Movie
          </Button>
          <h1 className="text-2xl font-bold">Similar Movies</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array(15)
            .fill(0)
            .map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
        <p>Please select a valid movie to see similar recommendations.</p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  const similarMovies = movie.similar?.results || [];

  const sortedMovies = [...similarMovies].sort((a, b) => {
    if (sortBy === "popularity.desc") {
      return b.popularity - a.popularity;
    } else if (sortBy === "vote_average.desc") {
      return b.vote_average - a.vote_average;
    } else if (sortBy === "release_date.desc") {
      return (
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      );
    }
    return 0;
  });

  return (
    <Suspense>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Movie
            </Button>
            <h1 className="text-xl font-bold ">More Like {movie.title}</h1>
          </div>
        </div>

        {similarMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No similar movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {sortedMovies.map((movie) => (
              <Link
                href={`/movies/${movie.id}`}
                key={movie.id}
                className="rounded-lg overflow-hidden bg-card border border-border hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative aspect-[2/3]">
                  <Image
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/placeholder.png"
                    }
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    {movie.vote_average?.toFixed(1) || "N/A"}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {movie.genre_ids?.slice(0, 2).map((genreId: number) => (
                      <span
                        key={genreId}
                        className="text-xs bg-muted px-2 py-0.5 rounded-full"
                      >
                        {getGenreName(genreId, movie)}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}

function getGenreName(genreId: number, movie: Movie): string {
  if (movie.genres) {
    const genre = movie.genres.find((g) => g.id === genreId);
    if (genre) return genre.name;
  }

  const genreMap: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  return genreMap[genreId] || "Unknown";
}
