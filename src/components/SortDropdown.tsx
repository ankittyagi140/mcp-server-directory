"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

interface SortDropdownProps {
  currentSort?: string;
  currentSearch?: string;
}

export default function SortDropdown({ currentSort, currentSearch }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
  ];

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    // Preserve search parameter if it exists
    if (currentSearch) {
      params.set("search", currentSearch);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 min-w-[160px]">
        <label htmlFor="sort-select" className="text-sm font-medium whitespace-nowrap">
          <ArrowUpDown className="h-4 w-4 inline mr-2" />
          Sort by:
        </label>
        <select
          id="sort-select"
          value={currentSort || "latest"}
          onChange={handleSortChange}
          className="cursor-pointer h-9 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 