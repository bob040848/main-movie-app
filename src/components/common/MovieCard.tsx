import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Movie } from "@/types/index";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.png";

  const rating =
    movie.vote_average !== undefined && movie.vote_average !== null
      ? movie.vote_average.toFixed(1)
      : "N/A";

  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="group rounded-lg overflow-hidden bg-card border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition"
          />
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs">{rating}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
}
