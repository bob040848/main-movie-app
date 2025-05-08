import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGenres } from "@/hooks/useGenres";
import { Genre } from "@/types";

type GenreFilterProps = {
  className?: string;
  onGenreSelect?: () => void;
};

export default function GenreFilter({
  className,
  onGenreSelect,
}: GenreFilterProps) {
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const genreDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { genres, isLoading: isLoadingGenres } = useGenres();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target as Node)
      ) {
        setShowGenreDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGenreClick = (id: number, name: string) => {
    router.push(`/genres?id=${id}&name=${encodeURIComponent(name)}`);
    setShowGenreDropdown(false);

    if (onGenreSelect) {
      onGenreSelect();
    }
  };

  return (
    <div ref={genreDropdownRef} className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() => setShowGenreDropdown(!showGenreDropdown)}
      >
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Genres</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {showGenreDropdown && (
        <div className="absolute top-full left-0 mt-1 w-60 bg-background border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg max-h-96 overflow-y-auto z-50 bg-white dark:bg-gray-900">
          <div className="p-2">
            <h3 className="font-semibold text-sm px-2 py-1">Browse by Genre</h3>

            {isLoadingGenres ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading genres...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1 mt-1">
                {genres?.map((genre: Genre) => (
                  <Button
                    key={genre.id}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-left h-8"
                    onClick={() => handleGenreClick(genre.id, genre.name)}
                  >
                    {genre.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
