import GenresPage from "@/components/common/GenresPage";
import React, { Suspense } from "react";

const GenresPages = () => {
  return (
    <Suspense>
      <GenresPage />
    </Suspense>
  );
};

export default GenresPages;
