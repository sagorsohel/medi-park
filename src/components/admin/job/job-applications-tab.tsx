"use client";

import { useState, useMemo, useEffect } from "react";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { JobApplicationTable, type JobApplicationData } from "@/components/admin/job/job-application-table";
import { Loader2 } from "lucide-react";
import { useGetJobApplicationsQuery, useDeleteJobApplicationMutation } from "@/services/jobApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import toast from "react-hot-toast";

export function JobApplicationsTab() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [appToDelete, setAppToDelete] = useState<string | null>(null);

    const { data, isLoading, refetch } = useGetJobApplicationsQuery({ page: currentPage });
    const [deleteJobApplication] = useDeleteJobApplicationMutation();

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const mappedApps: JobApplicationData[] = useMemo(() => {
        if (!data?.data) return [];
        return data.data.map((app) => ({
            id: `APP-${app.id.toString().padStart(4, "0")}`,
            name: app.name || "N/A",
            email: app.email || "N/A",
            phone: app.phone || "N/A",
            jobAppliedFor: app.job?.job_title || "Unknown",
            appliedAt: app.applied_at || app.created_at || new Date().toISOString(),
            resumeUrl: app.resume_url,
            originalId: app.id,
        }));
    }, [data]);

    const filteredApps = useMemo(() => {
        let result = mappedApps;

        if (searchQuery) {
            result = result.filter(
                (app) =>
                    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    app.jobAppliedFor.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return result;
    }, [searchQuery, filter, mappedApps]);

    const pagination = {
        current_page: data?.current_page || 1,
        last_page: data?.last_page || 1,
        total: data?.total || 0,
        per_page: 15,
    };

    const showingFrom = (pagination.current_page - 1) * pagination.per_page + 1;
    const showingTo = Math.min(pagination.current_page * pagination.per_page, pagination.total);

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedIds(filteredApps.map((j) => j.id));
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

    const handleAction = (id: string, action: string) => {
        if (action === "delete") {
            setAppToDelete(id);
            setDeleteConfirmOpen(true);
        } else if (action === "view") {
            console.log(`View app: ${id}`);
        }
    };

    const handleDelete = async () => {
        if (!appToDelete) return;

        try {
            await deleteJobApplication(Number(appToDelete)).unwrap();
            toast.success("Application deleted successfully!");
            setDeleteConfirmOpen(false);
            setAppToDelete(null);
            refetch();
        } catch (error) {
            console.error("Failed to delete application:", error);
            toast.error("Failed to delete application. Please try again.");
        }
    };

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        setCurrentPage(1);
        refetch();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mt-2">
                <DataTableFilters
                    onBulkAction={() => { }}
                    onFilterChange={handleFilterChange}
                    onSearch={setSearchQuery}
                    searchPlaceholder="Search applicants..."
                />
            </div>

            {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <JobApplicationTable
                        applications={filteredApps}
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onSelectOne={handleSelectOne}
                        onAction={handleAction}
                    />
                </div>
            )}

            {pagination.last_page > 1 && (
                <DataTablePagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.last_page}
                    totalEntries={pagination.total}
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
                title="Delete Application"
                description="Are you sure you want to delete this applicant data? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}
