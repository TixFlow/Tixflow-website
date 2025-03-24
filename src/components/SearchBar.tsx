"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const SearchBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedSearch = localStorage.getItem("searchTerm");
    if (savedSearch) setSearch(savedSearch);
  }, []);

  useEffect(() => {
    if (search) localStorage.setItem("searchTerm", search);
  }, [search]);

  const handleSearch = () => {
    if (search.trim() !== "") {
      router.push(`/ticket?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="search-bar flex items-center border border-gray-300 rounded-full shadow-md bg-white overflow-hidden px-4 py-2 w-[600px]">
      <Search size={22} className="text-gray-500 mr-3" />
      <input
        type="text"
        placeholder="Bạn tìm kiếm gì hôm nay?"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-grow px-2 py-2 text-gray-700 bg-transparent focus:outline-none"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        type="button"
        onClick={handleSearch}
        className="flex-shrink-0 px-5 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition duration-300 active:scale-95"
      >
        Tìm kiếm
      </button>
    </div>
  );
};

export default SearchBar;
