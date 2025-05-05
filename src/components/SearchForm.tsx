"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import React from "react";
import { Search } from "lucide-react";

export interface SearchFormProps {
  currentSort?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ currentSort }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("search", query);
      params.set("page", "1"); // Reset to first page when searching
    } else {
      params.delete("search");
    }
    
    // Preserve sort parameter if it exists
    if (currentSort) {
      params.set("sort", currentSort);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, description, or tags..."
            className="w-full rounded-md border border-input bg-background p-2 sm:p-2.5 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <button
          type="submit"
          className="w-full cursor-pointer sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm; 