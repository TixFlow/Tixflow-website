"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useSearch } from "@/context/searchContext/searchContext";

const SearchBar = () => {
  const router = useRouter();
  const { query, setQuery, applySearch } = useSearch();

  const handleSearch = () => {
    applySearch();

    router.push(`/tickets?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="search-bar flex items-center border border-gray-300 rounded-full shadow-md bg-white overflow-hidden px-4 py-2 w-[500px]">
      <Search size={18} className="text-gray-500 mr-3" />
      <input
        type="text"
        placeholder="Bạn tìm kiếm gì hôm nay?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-2 text-sm text-gray bg-transparent focus:outline-none"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="flex-shrink-0 px-4 py-2 bg-primary text-xs text-white font-medium rounded-full hover:bg-orange-500 transition duration-150 ease-in-out active:scale-95"
      >
        Tìm kiếm
      </button>
    </div>
  );
};

export default SearchBar;
