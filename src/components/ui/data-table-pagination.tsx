"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  showingFrom?: number;
  showingTo?: number;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  totalEntries,
  entriesPerPage,
  onPageChange,
  showingFrom,
  showingTo,
}: DataTablePaginationProps) {
  const from = showingFrom ?? (currentPage - 1) * entriesPerPage + 1;
  const to = showingTo ?? Math.min(currentPage * entriesPerPage, totalEntries);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Showing {String(from).padStart(2, "0")} to {String(to).padStart(2, "0")} of {totalEntries} entries
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#e0f2f7] text-gray-700 hover:bg-[#d0e2f7]"
          } rounded-lg px-4 py-2`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-[#1e40af] text-white"
                  : "bg-white text-[#1e40af] border border-[#1e40af] hover:bg-[#e0f2f7]"
              }`}
            >
              {String(page).padStart(2, "0")}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#1e40af] text-white hover:bg-[#1e3a8a]"
          } rounded-lg px-4 py-2`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

