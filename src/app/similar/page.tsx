import SimilarMoviesPage from "@/components/common/SimilarMoviesPage";
import React, { Suspense } from "react";

const Similar = () => {
  return (
    <Suspense>
      <SimilarMoviesPage />
    </Suspense>
  );
};

export default Similar;
