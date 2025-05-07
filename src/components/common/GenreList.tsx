import { useState } from "react";
import { useGenres } from "@/hooks/useGenres";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import GenreButton from "./GenreButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Genre } from "@/types";

type GenreListProps = {
  title?: string;
  subtitle?: string;
  activeGenreId?: string | null;
  onGenreClick?: (id: number, name: string) => void;
  columns?: 1 | 2;
  showSearch?: boolean;
};

export default function GenreList({
  title = "Genres",
  subtitle = "See lists of movies by genre",
  activeGenreId = null,
  onGenreClick,
  columns = 1,
  showSearch = false,
}: GenreListProps) {
  const { genres, isLoading } = useGenres();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGenres = genres?.filter((genre: Genre) =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        {subtitle && (
          <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
        )}
        <div className="space-y-2">
          {Array(20)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      {subtitle && (
        <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      )}

      {showSearch && (
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      )}

      <div
        className={`grid ${
          columns === 2 ? "grid-cols-2" : "grid-cols-1"
        } gap-2 mt-4`}
      >
        {filteredGenres?.map((genre: Genre) => (
          <GenreButton
            key={genre.id}
            id={genre.id}
            name={genre.name}
            isActive={
              activeGenreId ? Number(activeGenreId) === genre.id : false
            }
            onClick={
              onGenreClick
                ? () => onGenreClick(genre.id, genre.name)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
