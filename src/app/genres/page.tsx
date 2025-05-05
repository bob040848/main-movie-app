"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function GenresPage() {
  const searchParams = useSearchParams();
  const genreId = searchParams.get("id");
  const genreName = searchParams.get("name");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {genreName ? `${genreName} Movies` : "Browse by Genres"}
        </h1>
        <p className="text-muted-foreground">
          {genreId
            ? "Explore movies in this genre"
            : "Select a genre to explore movies"}
        </p>
      </div>
    </div>
  );
}
