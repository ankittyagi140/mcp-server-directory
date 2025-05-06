"use client";

import { useState } from "react";
// import { Search } from "lucide-react";

const POPULAR_TAGS = [
  "authentication",
  "vanilla",
  "modded",
  "official",
  "community",
  "plugin-support",
  "fast",
  "stable",
];

export default function ServerFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Search</h3>
        <div className="relative">
          {/* <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> */}
          <input
            type="text"
            placeholder="Search servers..."
            className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-medium">Filter by Tags</h3>
        <div className="space-y-2">
          {POPULAR_TAGS.map((tag) => (
            <label
              key={tag}
              className="flex items-center space-x-2"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              <span className="text-sm">{tag}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-medium">Filter by Features</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">Has GitHub Link</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">Has Logo</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">Has Documentation</span>
          </label>
        </div>
      </div>
      
      <button
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Apply Filters
      </button>
    </div>
  );
} 