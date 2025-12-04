"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DoctorTable, type Doctor } from "@/components/admin/doctor-table";
import { Button } from "@/components/ui/button";

// Mock data based on the image
const mockDoctors: Doctor[] = [
    {
        id: "HW0785543",
        name: "Md Shakhawat Hossain",
        department: "Anesthesiology",
        qualification: "MBBS",
        experience: "4+ years",
        totalAppointments: 200,
        status: true,
    },
    {
        id: "HW0785543",
        name: "Md Shakhawat Hossain",
        department: "Dental Surgery",
        qualification: "MDS",
        experience: "3+ years",
        totalAppointments: 200,
        status: true,
    },
    {
        id: "HW0785543",
        name: "Md Shakhawat Hossain",
        department: "Dermatology",
        qualification: "MS",
        experience: "6+ years",
        totalAppointments: 498,
        status: true,
    },
    {
        id: "HW0785543",
        name: "Md Shakhawat Hossain",
        department: "ENT Surgery",
        qualification: "MBBS",
        experience: "2+ years",
        totalAppointments: 300,
        status: true,
    },
    {
        id: "HW0785543",
        name: "Md Shakhawat Hossain",
        department: "General Medicine",
        qualification: "MS",
        experience: "2+ years",
        totalAppointments: 839,
        status: true,
    },
    {
        id: "HW0785543",
        name: "Md Shakhawat Hossain",
        department: "Ophthalmology",
        qualification: "MS",
        experience: "2+ years",
        totalAppointments: 837,
        status: true,
    },
    {
        id: "HW0785543",
        name: "Md Shakhawat Hossain",
        department: "Orthopedics",
        qualification: "MBBS",
        experience: "6+ years",
        totalAppointments: 392,
        status: true,
    },
    {
        id: "HW0785543",
        name: "Md Shakhawat Hossain",
        department: "Pediatrics",
        qualification: "MBBS",
        experience: "6+ years",
        totalAppointments: 283,
        status: true,
    },
    {
        id: "HW0785543",
        name: "Md Shakhawat Hossain",
        department: "Radiology",
        qualification: "MDS",
        experience: "2+ years",
        totalAppointments: 342,
        status: true,
    },
    {
        id: "HW0785543",
        name: "Md Shakhawat Hossain",
        department: "Cardiology",
        qualification: "MBBS",
        experience: "3+ years",
        totalAppointments: 743,
        status: true,
    },
];

export default function DoctorPage() {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const entriesPerPage = 12;

    // Filter and search doctors
    const filteredDoctors = useMemo(() => {
        let result = mockDoctors;

        // Apply search
        if (searchQuery) {
            result = result.filter(
                (doctor) =>
                    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    doctor.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    doctor.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply filter
        if (filter === "active") {
            result = result.filter((doctor) => doctor.status);
        } else if (filter === "inactive") {
            result = result.filter((doctor) => !doctor.status);
        }

        return result;
    }, [searchQuery, filter]);

    // Paginate doctors
    const paginatedDoctors = useMemo(() => {
        const start = (currentPage - 1) * entriesPerPage;
        const end = start + entriesPerPage;
        return filteredDoctors.slice(start, end);
    }, [filteredDoctors, currentPage]);

    const totalPages = Math.ceil(filteredDoctors.length / entriesPerPage);
    const showingFrom = (currentPage - 1) * entriesPerPage + 1;
    const showingTo = Math.min(currentPage * entriesPerPage, filteredDoctors.length);

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedIds(paginatedDoctors.map((d) => d.id));
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
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor</h1>
                    <p className="text-gray-600">Here's what happening in your update</p>
                </div>
                <Button onClick={() => navigate("/admin/doctor/new")}>Add New</Button>
                {/* Placeholder for Add New button if needed later */}
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
                <DoctorTable
                    doctors={paginatedDoctors}
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
                totalEntries={filteredDoctors.length}
                entriesPerPage={entriesPerPage}
                onPageChange={setCurrentPage}
                showingFrom={showingFrom}
                showingTo={showingTo}
            />
        </div>
    );
}
