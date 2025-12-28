"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit2, Trash2, Eye } from "lucide-react";
import { useGetFacilitiesQuery, useDeleteFacilityMutation } from "@/services/homepageApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import toast from "react-hot-toast";

export default function FacilitiesPage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);

    const { data, isLoading, refetch } = useGetFacilitiesQuery(currentPage);
    const [deleteFacility] = useDeleteFacilityMutation();

    // Filter and search facilities
    const filteredFacilities = useMemo(() => {
        if (!data?.data) return [];

        let result = data.data;

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (facility) =>
                    facility.title.toLowerCase().includes(query)
            );
        }

        // Apply filter
        if (filter === "active") {
            result = result.filter((facility) => facility.status === "active");
        } else if (filter === "inactive") {
            result = result.filter((facility) => facility.status === "inactive");
        }

        return result;
    }, [searchQuery, filter, data]);

    const pagination = data?.pagination;
    const showingFrom = pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
    const showingTo = pagination
        ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
        : 0;

    const handleAction = (id: number, action: string) => {
        if (action === "delete") {
            setFacilityToDelete(id);
            setDeleteConfirmOpen(true);
        } else if (action === "edit") {
            navigate(`/admin/website/facilities/edit/${id}`);
        } else if (action === "view") {
            navigate(`/admin/website/facilities/view/${id}`);
        }
    };

    const handleDelete = async () => {
        if (!facilityToDelete) return;

        try {
            await deleteFacility(facilityToDelete).unwrap();
            toast.success("Facility deleted successfully!");
            setDeleteConfirmOpen(false);
            setFacilityToDelete(null);
            refetch();
        } catch (error) {
            console.error("Failed to delete facility:", error);
            toast.error("Failed to delete facility. Please try again.");
        }
    };

    const handleBulkAction = (action: string) => {
        console.log(`Bulk action: ${action}`);
        // Handle bulk actions
    };

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Facilities</h1>
                    <p className="text-gray-600">Manage facility information</p>
                </div>
                <Button onClick={() => navigate("/admin/website/facilities/new")}>Add New Facility</Button>
            </div>

            <div className="py-8">
                {/* Filters */}
                <DataTableFilters
                    onBulkAction={handleBulkAction}
                    onFilterChange={handleFilterChange}
                    onSearch={setSearchQuery}
                    searchPlaceholder="Search facilities..."
                />
            </div>

            {/* Facilities List */}
            {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <>
                    {filteredFacilities.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                            No facilities found. Click "Add New Facility" to create one.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredFacilities.map((facility) => {
                                const doctorCount = facility.doctors?.length || 0;
                                const blogCount = facility.blogs?.length || 0;
                                
                                return (
                                    <Card
                                        key={facility.id}
                                        className={`border ${facility.status === "active"
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                            }`}
                                    >
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg line-clamp-1">{facility.title}</CardTitle>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAction(facility.id, "view")}
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAction(facility.id, "edit")}
                                                    >
                                                        <Edit2 className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleAction(facility.id, "delete")}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4 p-3">
                                            <div>
                                                <img
                                                    src={facility.image}
                                                    alt={facility.title}
                                                    className="w-full h-48 object-cover rounded border"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "/vite.svg";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-gray-700 line-clamp-2">{facility.title}</p>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-600">Doctors:</span>
                                                        <span className="font-semibold text-blue-600">{doctorCount}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-600">Blogs:</span>
                                                        <span className="font-semibold text-green-600">{blogCount}</span>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    facility.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {facility.status}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
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
                </>
            )}

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDelete}
                title="Delete Facility"
                description="Are you sure you want to delete this facility? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}

