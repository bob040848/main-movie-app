"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieCard from "./MovieCard";
import { Movie } from "@/types/index";
import MovieCardSkeleton from "./MovieCardSkeleton";

interface MovieCarouselProps {
  title: string;
  movies?: Movie[];
  isLoading?: boolean;
}

export default function MovieCarousel({
  title,
  movies,
  isLoading,
}: MovieCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;

      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
      >
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex-shrink-0 w-40 md:w-48 snap-start">
                  <MovieCardSkeleton />
                </div>
              ))
          : movies?.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-40 md:w-48 snap-start"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
      </div>
    </section>
  );
}
