"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMovieDetails } from "@/hooks/useMovies";
import { Suspense, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Filter, ChevronLeft } from "lucide-react";
import Link from "next/link";
import MovieCardSkeleton from "@/components/common/MovieCardSkeleton";
import { Movie } from "@/types";

export default function SimilarMoviesMorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = parseInt(searchParams.get("id") || "0", 10);
  const { movie, isLoading } = useMovieDetails(movieId);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popularity.desc");

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
      const popA = a.popularity ?? 0;
      const popB = b.popularity ?? 0;
      return popB - popA;
    } else if (sortBy === "vote_average.desc") {
      const voteA = a.vote_average ?? 0;
      const voteB = b.vote_average ?? 0;
      return voteB - voteA;
    } else if (sortBy === "release_date.desc") {
      if (!a.release_date) return 1;
      if (!b.release_date) return -1;
      return (
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      );
    }
    return 0;
  });

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

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
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold">More Like {movie.title}</h1>
          </div>
          <Button
            variant="outline"
            className="flex items-center"
            onClick={toggleFilter}
          >
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>

        {filterOpen && (
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Sort By</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={sortBy === "popularity.desc" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popularity.desc")}
              >
                Popularity
              </Button>
              <Button
                variant={sortBy === "vote_average.desc" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("vote_average.desc")}
              >
                Rating
              </Button>
              <Button
                variant={sortBy === "release_date.desc" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("release_date.desc")}
              >
                Release Date
              </Button>
            </div>
          </div>
        )}

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
                    className="object-cover"
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
