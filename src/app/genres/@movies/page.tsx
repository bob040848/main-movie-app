import GenreMoviesPage from "@/components/common/GenresAtMovies";
import React, { Suspense } from "react";

const GenresAtMovie = () => {
  return (
    <Suspense>
      <GenreMoviesPage />
    </Suspense>
  );
};

export default GenresAtMovie;
