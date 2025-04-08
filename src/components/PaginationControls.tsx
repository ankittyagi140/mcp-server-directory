"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  basePath: string;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  basePath,
}: PaginationControlsProps) {


  // Generate page numbers to display
  const getPageNumbers = () => {
    // Always show first and last page plus a certain range around current page
    const range = 1; // Number of pages to show on each side of current page
    const pages: (number | string)[] = [];

    // Add first page
    pages.push(1);

    // Calculate range start and end
    const rangeStart = Math.max(2, currentPage - range);
    const rangeEnd = Math.min(totalPages - 1, currentPage + range);

    // Add ellipsis after first page if there's a gap
    if (rangeStart > 2) {
      pages.push("...");
    }

    // Add range of pages around current page
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if there's a gap
    if (rangeEnd < totalPages - 1 && totalPages > 1) {
      pages.push("...");
    }

    // Add last page if it's not already included
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Helper function to create page URLs
  const createPageUrl = (page: number, size: number = pageSize) => {
    const searchParams = new URLSearchParams();
    searchParams.set('page', String(page));
    
    // Only add pageSize if it's different from default
    if (size !== 9) {
      searchParams.set('pageSize', String(size));
    }
    
    return `${basePath}?${searchParams.toString()}`;
  };

  // Always render the pagination controls, even for one page
  // This helps with debugging and consistency of UI layout
  const pageNumbers = getPageNumbers();

  // For single page, still render simplified controls
  if (totalPages <= 1) {
    return (
      <nav className="flex items-center justify-center space-x-1">
        {/* Disabled Previous button */}
        <span
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-300 cursor-not-allowed"
          aria-disabled={true}
        >
          <span className="sr-only">Previous Page</span>
          <ChevronLeft className="h-4 w-4" />
        </span>

        {/* Current page (1) */}
        <span
          className="flex h-9 w-9 items-center justify-center rounded-md border border-green-600 bg-green-50 text-green-600 font-medium text-sm"
          aria-current="page"
        >
          1
        </span>

        {/* Disabled Next button */}
        <span
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-300 cursor-not-allowed"
          aria-disabled={true}
        >
          <span className="sr-only">Next Page</span>
          <ChevronRight className="h-4 w-4" />
        </span>

        {/* Page size dropdown - still available for single page */}
        <select
          className="ml-4 h-9 rounded-md border border-gray-300 bg-white px-2 text-sm"
          value={pageSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            window.location.href = createPageUrl(1, newSize);
          }}
          aria-label="Items per page"
        >
          <option value="9">9 per page</option>
          <option value="18">18 per page</option>
          <option value="27">27 per page</option>
          <option value="36">36 per page</option>
        </select>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-center space-x-1">
      {/* Previous page button */}
      <Link
        href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
        className={`flex h-9 w-9 items-center justify-center rounded-md border ${
          currentPage > 1
            ? "border-gray-300 hover:bg-gray-50"
            : "border-gray-200 text-gray-300 cursor-not-allowed"
        }`}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
        onClick={(e) => {
          if (currentPage <= 1) e.preventDefault();
        }}
      >
        <span className="sr-only">Previous Page</span>
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {/* Page number buttons */}
      {pageNumbers.map((pageNum, idx) => {
        // For ellipsis
        if (typeof pageNum === "string") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-9 w-9 items-center justify-center text-sm"
            >
              {pageNum}
            </span>
          );
        }

        // For page numbers
        return (
          <Link
            key={`page-${pageNum}`}
            href={createPageUrl(pageNum)}
            className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm ${
              currentPage === pageNum
                ? "border-green-600 bg-green-50 text-green-600 font-medium"
                : "border-gray-300 hover:bg-gray-50"
            }`}
            aria-current={currentPage === pageNum ? "page" : undefined}
          >
            {pageNum}
          </Link>
        );
      })}

      {/* Next page button */}
      <Link
        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
        className={`flex h-9 w-9 items-center justify-center rounded-md border ${
          currentPage < totalPages
            ? "border-gray-300 hover:bg-gray-50"
            : "border-gray-200 text-gray-300 cursor-not-allowed"
        }`}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
        onClick={(e) => {
          if (currentPage >= totalPages) e.preventDefault();
        }}
      >
        <span className="sr-only">Next Page</span>
        <ChevronRight className="h-4 w-4" />
      </Link>

      {/* Page size dropdown - optional, remove if not needed */}
      <select
        className="ml-4 h-9 rounded-md border border-gray-300 bg-white px-2 text-sm"
        value={pageSize}
        onChange={(e) => {
          const newSize = Number(e.target.value);
          window.location.href = createPageUrl(1, newSize);
        }}
        aria-label="Items per page"
      >
        <option value="9">9 per page</option>
        <option value="18">18 per page</option>
        <option value="27">27 per page</option>
        <option value="36">36 per page</option>
      </select>
    </nav>
  );
} 