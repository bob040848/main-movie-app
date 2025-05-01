"use client";

import { useRouter, useSearchParams } from "next/navigation";
import GenreList from "@/components/common/GenreList";

export default function GenresListPage() {
  const searchParams = useSearchParams();
  const activeGenreId = searchParams.get("id");
  const router = useRouter();

  const handleGenreClick = (genreId: number, genreName: string) => {
    router.push(`/genres?id=${genreId}&name=${encodeURIComponent(genreName)}`);
  };

  return (
    <GenreList
      activeGenreId={activeGenreId}
      onGenreClick={handleGenreClick}
      showSearch={true}
    />
  );
}
