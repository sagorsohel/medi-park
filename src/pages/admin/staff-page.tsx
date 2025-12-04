"use client";

import { useState, useMemo } from "react";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { StaffTable, type StaffMember } from "@/components/admin/staff-table";

// Mock data - replace with API call
const mockStaff: StaffMember[] = [
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Help Desk",
    joiningDate: "09.25.2025",
    address: "123 Main St, CA",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Manager",
    joiningDate: "09.25.2025",
    address: "456 Oak Ave, Ny",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Cleaner",
    joiningDate: "09.25.2025",
    address: "123 Main St, CA",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Driver",
    joiningDate: "09.25.2025",
    address: "456 Oak Ave, Ny",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Cashier",
    joiningDate: "09.25.2025",
    address: "123 Main St, CA",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Delivery",
    joiningDate: "09.25.2025",
    address: "456 Oak Ave, Ny",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Report",
    joiningDate: "09.25.2025",
    address: "123 Main St, CA",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Help Desk",
    joiningDate: "09.25.2025",
    address: "456 Oak Ave, Ny",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Manager",
    joiningDate: "09.25.2025",
    address: "123 Main St, CA",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Cleaner",
    joiningDate: "09.25.2025",
    address: "456 Oak Ave, Ny",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Driver",
    joiningDate: "09.25.2025",
    address: "123 Main St, CA",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
  {
    id: "HW0785543",
    name: "Md Shakhawat Hossain",
    role: "Cashier",
    joiningDate: "09.25.2025",
    address: "456 Oak Ave, Ny",
    mobileNo: "+880 1XXXXX-XXXX",
    email: "technical.mirshovon@gmail.com",
    salary: "100.00",
    status: false,
  },
];

export default function StaffPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const entriesPerPage = 12;

  // Filter and search staff
  const filteredStaff = useMemo(() => {
    let result = mockStaff;

    // Apply search
    if (searchQuery) {
      result = result.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filter
    if (filter === "active") {
      result = result.filter((staff) => staff.status);
    } else if (filter === "inactive") {
      result = result.filter((staff) => !staff.status);
    }

    return result;
  }, [searchQuery, filter]);

  // Paginate staff
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    const end = start + entriesPerPage;
    return filteredStaff.slice(start, end);
  }, [filteredStaff, currentPage]);

  const totalPages = Math.ceil(filteredStaff.length / entriesPerPage);
  const showingFrom = (currentPage - 1) * entriesPerPage + 1;
  const showingTo = Math.min(currentPage * entriesPerPage, filteredStaff.length);

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(paginatedStaff.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleStatusChange = (id: string, status: boolean) => {
    // Update status - replace with API call
    console.log(`Status changed for ${id}: ${status}`);
  };

  const handleAction = (id: string, action: string) => {
    console.log(`Action ${action} for ${id}`);
    // Handle actions (edit, view, delete)
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`, selectedIds);
    // Handle bulk actions
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HR</h1>
        <p className="text-gray-600">Here's what happening in your update</p>
      </div>

      {/* Filters */}
      <DataTableFilters
        onBulkAction={handleBulkAction}
        onFilterChange={handleFilterChange}
        onSearch={setSearchQuery}
        searchPlaceholder="Search"
      />

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <StaffTable
          staff={paginatedStaff}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onStatusChange={handleStatusChange}
          onAction={handleAction}
        />
      </div>

      {/* Pagination */}
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={filteredStaff.length}
        entriesPerPage={entriesPerPage}
        onPageChange={setCurrentPage}
        showingFrom={showingFrom}
        showingTo={showingTo}
      />
    </div>
  );
}

