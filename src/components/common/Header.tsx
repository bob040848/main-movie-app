"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { Film, Search, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useMovieSearch } from "@/hooks/useMovies";
import GenreFilter from "./GenreFilter";
import { useSearchContext } from "@/context/SearchContext";

import Image from "next/image";
import { Movie } from "@/types";

export default function Header() {
  const { globalSearchQuery, setGlobalSearchQuery } = useSearchContext();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const { movies: searchResults, isLoading: isLoadingSearch } = useMovieSearch(
    localSearchQuery.length >= 2 ? localSearchQuery : ""
  );

  useEffect(() => {
    setMounted(true);

    if (pathname === "/search") {
      const urlQuery = searchParams.get("q") || "";
      if (urlQuery) {
        setLocalSearchQuery(urlQuery);
      }
    }
  }, []);

  useEffect(() => {
    if (
      pathname === "/search" &&
      globalSearchQuery &&
      globalSearchQuery !== localSearchQuery
    ) {
      setLocalSearchQuery(globalSearchQuery);
    }
  }, [globalSearchQuery, pathname]);

  const resetSearch = () => {
    setLocalSearchQuery("");
    setGlobalSearchQuery("");
    setShowSearchResults(false);
  };

  const updateGlobalSearch = (query: string) => {
    setLocalSearchQuery(query);

    if (pathname === "/search") {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }

      searchDebounceRef.current = setTimeout(() => {
        if (query.trim()) {
          setGlobalSearchQuery(query.trim());
        }
      }, 300);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      setGlobalSearchQuery(localSearchQuery.trim());

      const currentUrlQuery = searchParams.get("q");
      if (
        pathname !== "/search" ||
        currentUrlQuery !== localSearchQuery.trim()
      ) {
        router.push(`/search?q=${encodeURIComponent(localSearchQuery.trim())}`);
      }

      setShowSearchResults(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Suspense>
      <header className="bg-background border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-30 backdrop-blur-[50px]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-2xl font-bold text-indigo-600"
                onClick={resetSearch}
              >
                <Film className="h-6 w-6" />
                <span>MovieHub</span>
              </Link>

              <div className="block lg:hidden">
                {mounted ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle theme"
                    disabled
                  >
                    <div className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-1 md:max-w-xl lg:max-w-2xl mx-auto lg:mx-0">
              <div ref={searchContainerRef} className="relative w-full">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2"
                >
                  <GenreFilter onGenreSelect={resetSearch} />
                  <div className="relative flex-1">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for movies..."
                      value={localSearchQuery}
                      onChange={(e) => {
                        const newQuery = e.target.value;
                        updateGlobalSearch(newQuery);
                        if (newQuery.length >= 2) {
                          setShowSearchResults(true);
                        } else {
                          setShowSearchResults(false);
                        }
                      }}
                      className="pl-10 w-full"
                      onFocus={() => {
                        if (localSearchQuery.length >= 2) {
                          setShowSearchResults(true);
                        }
                      }}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {localSearchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => {
                          resetSearch();
                          searchInputRef.current?.focus();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button type="submit" variant="default">
                    Search
                  </Button>
                </form>

                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg max-h-96 overflow-y-auto z-50 bg-white dark:bg-gray-900">
                    {isLoadingSearch ? (
                      <div className="p-4 text-center">Loading...</div>
                    ) : searchResults?.length === 0 ? (
                      <div className="p-4 text-center">No results found</div>
                    ) : (
                      <div>
                        {searchResults?.slice(0, 5).map((movie: Movie) => (
                          <Link
                            key={movie.id}
                            href={`/movies/${movie.id}`}
                            onClick={() => {
                              resetSearch();
                            }}
                          >
                            <div className="flex items-center gap-3 p-3 hover:bg-secondary transition cursor-pointer">
                              <div className="relative h-16 w-12 flex-shrink-0">
                                <Image
                                  src={
                                    movie.poster_path
                                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                      : "/placeholder.png"
                                  }
                                  alt={movie.title}
                                  fill
                                  sizes="48px"
                                  className="object-cover rounded-sm"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">
                                  {movie.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {movie.release_date
                                    ? new Date(movie.release_date).getFullYear()
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                        {searchResults && searchResults.length > 5 && (
                          <div className="p-2 border-t border-neutral-200 dark:border-neutral-800">
                            <Button
                              variant="link"
                              className="w-full"
                              onClick={() => {
                                setGlobalSearchQuery(localSearchQuery.trim());
                                router.push(
                                  `/search?q=${encodeURIComponent(
                                    localSearchQuery.trim()
                                  )}`
                                );
                                setShowSearchResults(false);
                              }}
                            >
                              View all results
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:block">
              {mounted ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle theme"
                  disabled
                >
                  <div className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    </Suspense>
  );
}
