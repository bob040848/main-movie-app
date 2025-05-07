"use client";

import { useParams } from "next/navigation";
import { useMovieDetails, useMovieVideos } from "@/hooks/useMovies";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Star,
  Clock,
  Play,
  User,
  Edit,
  Film,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import MovieCardSkeleton from "@/components/common/MovieCardSkeleton";
import { Movie, Video, Cast, Crew } from "@/types";
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
      (video: Video) => video.type === "Trailer" && video.site === "YouTube"
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

  const directors =
    movie.credits?.crew?.filter((person: Crew) => person.job === "Director") ||
    [];

  const writersMap = new Map();
  movie.credits?.crew
    ?.filter((person: Crew) =>
      ["Screenplay", "Writer", "Story"].includes(person.job)
    )
    .forEach((writer: Crew) => {
      if (writersMap.has(writer.id)) {
        const existingWriter = writersMap.get(writer.id);
        if (existingWriter.job !== writer.job) {
          existingWriter.job = `${existingWriter.job}, ${writer.job}`;
        }
      } else {
        writersMap.set(writer.id, { ...writer });
      }
    });
  const writers = Array.from(writersMap.values());

  const cast = movie.credits?.cast?.slice(0, 6) || [];

  const similarMovies = movie.similar?.results?.slice(0, 6) || [];

  return (
    <Suspense>
      <div>
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] mb-8">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            sizes="100vw"
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
                X
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
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-lg text-muted-foreground italic mb-4">
                  &ldquo;{movie.tagline}&rdquo;
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

              {directors.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <Film className="mr-2 h-5 w-5" />
                    Director{directors.length > 1 ? "s" : ""}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {directors.map((director: Crew) => (
                      <div key={director.id} className="flex items-center">
                        <span className="font-medium">{director.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {writers.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <Edit className="mr-2 h-5 w-5" />
                    Writer{writers.length > 1 ? "s" : ""}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {writers.map((writer) => (
                      <div key={writer.id} className="flex items-center">
                        <span className="font-medium">{writer.name}</span>
                        {writer.job && writer.job !== "Writer" && (
                          <span className="text-muted-foreground ml-1">
                            ({writer.job})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cast.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Cast
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {cast.map((actor: Cast) => (
                      <div key={actor.id} className="flex items-center">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden mr-2">
                          <Image
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                : "/placeholder-avatar.png"
                            }
                            alt={actor.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                            priority
                          />
                        </div>
                        <div>
                          <div className="font-medium">{actor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {actor.character}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {similarMovies.length > 0 && (
            <div className="mt-12 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">More Like This</h2>
                <Link href={`/similar?id=${movieId}`}>
                  <Button
                    variant="ghost"
                    className="flex items-center text-primary"
                  >
                    See more <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {similarMovies.map((movie: Movie) => (
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
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
