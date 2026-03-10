"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useGetHealthCheckupsQuery, useDeleteHealthCheckupMutation, useUpdateHealthCheckupMutation } from "@/services/healthCheckupApi";
import { HealthCheckupTable } from "@/components/admin/health-checkup-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import toast from "react-hot-toast";

export default function HealthCheckupManagePage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const { data, isLoading, refetch } = useGetHealthCheckupsQuery(currentPage);
    const [deleteItem] = useDeleteHealthCheckupMutation();
    const [updateItem] = useUpdateHealthCheckupMutation();

    // Filter and search items
    const filteredItems = useMemo(() => {
        if (!data?.data) return [];

        let result = data.data;

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (item) =>
                    item.title.toLowerCase().includes(query) ||
                    item.phone.toLowerCase().includes(query) ||
                    item.room_no.toLowerCase().includes(query)
            );
        }

        // Apply filter
        if (filter === "active") {
            result = result.filter((item) => item.status === "active");
        } else if (filter === "inactive") {
            result = result.filter((item) => item.status === "inactive");
        }

        return result;
    }, [searchQuery, filter, data]);

    const pagination = data?.pagination;
    const showingFrom = pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
    const showingTo = pagination
        ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
        : 0;

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedIds(filteredItems.map((item) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, selected: boolean) => {
        if (selected) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
        }
    };

    const handleStatusChange = async (id: number, status: boolean) => {
        try {
            await updateItem({
                id,
                data: { status: status ? "active" : "inactive" },
            }).unwrap();
            toast.success("Status updated successfully!");
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status.");
        }
    };

    const handleAction = (id: number, action: string) => {
        if (action === "delete") {
            setItemToDelete(id);
            setDeleteConfirmOpen(true);
        } else if (action === "edit") {
            navigate(`/admin/health-checkup/edit/${id}`);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;

        try {
            await deleteItem(itemToDelete).unwrap();
            toast.success("Health checkup deleted successfully!");
            setDeleteConfirmOpen(false);
            setItemToDelete(null);
            refetch();
        } catch (error) {
            console.error("Failed to delete item:", error);
            toast.error("Failed to delete item.");
        }
    };

    const handleBulkAction = (action: string) => {
        console.log(`Bulk action: ${action}`, selectedIds);
        // Implement bulk actions if needed
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
            {/* Header */}
            <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#111827] tracking-tight mb-2">Health Checkup Pages</h1>
                    <p className="text-[#6b7280] font-medium">Manage and organize health checkup department information</p>
                </div>
                <Button
                    onClick={() => navigate("/admin/health-checkup/new")}
                    className="bg-primary hover:bg-primary/95 text-white px-6 py-6 rounded-xl shadow-lg shadow-primary/20 transition-all font-bold flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Create New Page
                </Button>
            </div>

            <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <DataTableFilters
                        onBulkAction={handleBulkAction}
                        onFilterChange={(newFilter) => {
                            setFilter(newFilter);
                            setCurrentPage(1);
                        }}
                        onSearch={setSearchQuery}
                        searchPlaceholder="Search by title, phone, or room..."
                    />
                </div>

                {/* Table Section */}
                {isLoading ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-24 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                            <p className="text-sm font-medium text-gray-400 animate-pulse">Loading data...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {filteredItems.length === 0 ? (
                            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-24 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Plus className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No pages found</h3>
                                    <p className="text-gray-500 mb-8 font-medium">Get started by creating your first health checkup page</p>
                                    <Button
                                        onClick={() => navigate("/admin/health-checkup/new")}
                                        variant="outline"
                                        className="rounded-xl border-2 font-bold"
                                    >
                                        Create New Page
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <HealthCheckupTable
                                    items={filteredItems}
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
                            <div className="mt-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <DataTablePagination
                                    currentPage={pagination.current_page}
                                    totalPages={pagination.total_page}
                                    totalEntries={pagination.total_count}
                                    entriesPerPage={pagination.per_page}
                                    onPageChange={setCurrentPage}
                                    showingFrom={showingFrom}
                                    showingTo={showingTo}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDelete}
                title="Delete Health Checkup Page"
                description="This action will permanently delete this information. You cannot undo this action."
                confirmText="Delete Page"
                cancelText="Keep it"
                variant="destructive"
            />
        </div>
    );
}
