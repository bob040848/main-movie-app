import useSWR from "swr";
import { getGenres } from "@/lib/api";

export function useGenres() {
  const { data, error, isLoading } = useSWR("genres", getGenres);

  return {
    genres: data,
    isLoading,
    isError: error,
  };
}
