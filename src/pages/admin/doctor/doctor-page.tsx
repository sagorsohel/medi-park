"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DoctorTable, type Doctor as TableDoctor } from "@/components/admin/doctor-table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetDoctorsQuery, useDeleteDoctorMutation, type Doctor } from "@/services/doctorApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import toast from "react-hot-toast";

export default function DoctorPage() {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);

    const { data, isLoading, refetch } = useGetDoctorsQuery(currentPage);

    // Refetch on mount and page change
    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);
    const [deleteDoctor] = useDeleteDoctorMutation();

    // Map API doctors to table format
    const mappedDoctors: TableDoctor[] = useMemo(() => {
        if (!data?.data) return [];
        return data.data.map((doctor: Doctor) => ({
            id: doctor.doctor_identity_number,
            image: doctor.image || undefined,
            name: doctor.doctor_name,
            department: doctor.department,
            qualification: doctor.specialist || "N/A",
            experience: "N/A",
            totalAppointments: 0,
            status: true, // Default to true, can be updated if API provides status
        }));
    }, [data]);

    // Filter and search doctors
    const filteredDoctors = useMemo(() => {
        let result = mappedDoctors;

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
    }, [searchQuery, filter, mappedDoctors]);

    const pagination = data?.pagination;
    const showingFrom = pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
    const showingTo = pagination
        ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
        : 0;

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedIds(filteredDoctors.map((d) => d.id));
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
        // TODO: Implement status update API call
        console.log(`Status changed for ${id}: ${status}`);
    };

    const handleAction = (id: string, action: string) => {
        if (action === "delete") {
            setDoctorToDelete(id);
            setDeleteConfirmOpen(true);
        } else if (action === "edit") {
            const doctor = data?.data?.find((d: Doctor) => d.doctor_identity_number === id);
            if (doctor) {
                navigate(`/admin/doctor/edit/${doctor.id}`);
            }
        } else if (action === "view") {
            const doctor = data?.data?.find((d: Doctor) => d.doctor_identity_number === id);
            if (doctor) {
                navigate(`/admin/doctor/view/${doctor.id}`);
            }
        }
    };

    const handleDelete = async () => {
        if (!doctorToDelete) return;
        
        const doctor = data?.data?.find((d: Doctor) => d.doctor_identity_number === doctorToDelete);
        if (!doctor) return;

        try {
            await deleteDoctor(doctor.id).unwrap();
            toast.success("Doctor deleted successfully!");
            setDeleteConfirmOpen(false);
            setDoctorToDelete(null);
            refetch();
        } catch (error) {
            console.error("Failed to delete doctor:", error);
            toast.error("Failed to delete doctor. Please try again.");
        }
    };

    const handleBulkAction = (action: string) => {
        console.log(`Bulk action: ${action}`, selectedIds);
        // Handle bulk actions
    };

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        setCurrentPage(1);
        refetch();
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
            </div>

            {/* Filters */}
            <DataTableFilters
                onBulkAction={handleBulkAction}
                onFilterChange={handleFilterChange}
                onSearch={setSearchQuery}
                searchPlaceholder="Search"
            />

            {/* Table */}
            {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <DoctorTable
                        doctors={filteredDoctors}
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onSelectOne={handleSelectOne}
                        onStatusChange={handleStatusChange}
                        onAction={handleAction}
                    />
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total_page > 1 && (
                <DataTablePagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_page}
                    totalEntries={pagination.total_count}
                    entriesPerPage={pagination.per_page}
                    onPageChange={setCurrentPage}
                    showingFrom={showingFrom}
                    showingTo={showingTo}
                />
            )}

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDelete}
                title="Delete Doctor"
                description="Are you sure you want to delete this doctor? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}
