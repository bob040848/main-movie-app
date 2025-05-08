"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type SearchContextType = {
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  return (
    <SearchContext.Provider value={{ globalSearchQuery, setGlobalSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}
