"use client";

import { Search, ChevronDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableFiltersProps {
  onBulkAction?: (action: string) => void;
  onDateChange?: (date: string) => void;
  onFilterChange?: (filter: string) => void;
  onSearch?: (search: string) => void;
  searchPlaceholder?: string;
}

export function DataTableFilters({
  onBulkAction,
  onDateChange,
  onFilterChange,
  onSearch,
  searchPlaceholder = "Search",
}: DataTableFiltersProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Bulk Action Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <span>Bulk Action</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onBulkAction?.("activate")}>
            Activate Selected
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction?.("deactivate")}>
            Deactivate Selected
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction?.("delete")}>
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Date Picker */}
      <Button
        variant="outline"
        className="bg-white border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2"
        onClick={() => onDateChange?.("")}
      >
        <span>Date</span>
        <Calendar className="w-4 h-4" />
      </Button>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <span>Filter</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onFilterChange?.("all")}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange?.("active")}>
            Active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange?.("inactive")}>
            Inactive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search Bar */}
      <div className="flex-1 flex justify-end">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 bg-white border-gray-300 rounded-lg"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

