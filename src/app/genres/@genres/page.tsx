import GenresListPage from "@/components/common/GenreAtPages";
import React, { Suspense } from "react";

const GenresAt = () => {
  return (
    <Suspense>
      <GenresListPage />
    </Suspense>
  );
};

export default GenresAt;
