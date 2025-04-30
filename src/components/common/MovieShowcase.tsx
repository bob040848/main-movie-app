"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Star, Play } from "lucide-react";
import { useNowPlayingMovies } from "@/hooks/useMovies";

export default function MovieShowcase() {
  const { movies, isLoading } = useNowPlayingMovies();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || !movies?.length) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (movies?.length || 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [autoplay, movies?.length]);

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + (movies?.length || 1)) % (movies?.length || 1)
    );
    setAutoplay(false);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % (movies?.length || 1));
    setAutoplay(false);
  };

  if (isLoading || !movies?.length) {
    return (
      <div className="relative w-full h-96 md:h-[500px] bg-muted animate-pulse rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="absolute bottom-10 left-10 w-1/2 space-y-4">
          <div className="h-8 bg-muted-foreground/20 rounded w-3/4"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
          <div className="h-10 bg-muted-foreground/20 rounded w-40"></div>
        </div>
      </div>
    );
  }

  const activeMovie = movies[activeIndex];
  const backdropUrl = activeMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${activeMovie.backdrop_path}`
    : "/placeholder-wide.png";

  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={activeMovie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="container p-8 md:p-10">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              {activeMovie.title}
            </h1>

            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{activeMovie.vote_average?.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {activeMovie.release_date &&
                    new Date(activeMovie.release_date).getFullYear()}
                </span>
              </div>
            </div>

            <p className="text-sm md:text-base text-white/80 line-clamp-2">
              {activeMovie.overview}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link href={`/movies/${activeMovie.id}`}>
                <Button className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Watch Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 right-5 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/30 text-white border-white/20 hover:bg-black/50"
          onClick={handlePrev}
          aria-label="Previous movie"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-black/30 text-white border-white/20 hover:bg-black/50"
          onClick={handleNext}
          aria-label="Next movie"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1">
        {movies.slice(0, 5).map((_: any, index: any) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
            onClick={() => {
              setActiveIndex(index);
              setAutoplay(false);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
