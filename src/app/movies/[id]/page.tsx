"use client";

import { useParams } from "next/navigation";
import { useMovieDetails, useMovieVideos } from "@/hooks/useMovies";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, Clock, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MovieCardSkeleton from "@/components/common/MovieCardSkeleton";

export default function MovieDetails() {
  const { id } = useParams();
  const movieId =
    typeof id === "string"
      ? parseInt(id, 10)
      : Array.isArray(id)
      ? parseInt(id[0], 10)
      : 0;
  const { movie, isLoading } = useMovieDetails(movieId);
  const { videos } = useMovieVideos(movieId);
  const [showTrailer, setShowTrailer] = useState(false);

  const trailer =
    videos?.find(
      (video: any) => video.type === "Trailer" && video.site === "YouTube"
    ) || videos?.[0];

  if (isLoading) {
    return <MovieCardSkeleton />;
  }

  if (!movie) {
    return <div className="text-center py-16">Movie not found</div>;
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/placeholder-backdrop.png";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.png";

  return (
    <div>
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] mb-8">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        {trailer && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="outline"
              size="lg"
              className="bg-black/50 text-white border-white hover:bg-black/70"
              onClick={() => setShowTrailer(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Trailer
            </Button>
          </div>
        )}
      </div>

      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
            <Button
              className="absolute top-2 right-2"
              variant="destructive"
              size="sm"
              onClick={() => setShowTrailer(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative w-full md:w-1/3 aspect-[2/3] rounded-lg overflow-hidden">
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-lg text-muted-foreground italic mb-4">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-5 w-5" />
                <span>{movie.runtime || "?"} min</span>
              </div>

              <div>
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "N/A"}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p>{movie.overview}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((genre: any) => (
                  <Link href={`/genre/${genre.id}`} key={genre.id}>
                    <Button variant="secondary" size="sm">
                      {genre.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
