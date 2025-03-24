"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";

interface SearchContextType {
  query: string;
  appliedQuery: string;
  setQuery: (query: string) => void;
  applySearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/tickets")) {
      setQuery("");
      setAppliedQuery("");
    }
  }, [pathname]);

  const applySearch = () => {
    setAppliedQuery(query);
  };

  return (
    <SearchContext.Provider
      value={{ query, appliedQuery, setQuery, applySearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
