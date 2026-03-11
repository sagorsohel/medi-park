"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { JobTable, type Job as TableJob } from "@/components/admin/job/job-table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetJobDetailsQuery, useDeleteJobDetailMutation, useUpdateJobDetailMutation } from "@/services/jobApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { JobPostDetailModal } from "./job-post-detail-modal";
import toast from "react-hot-toast";

export function JobManageTab() {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<string | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any>(null);

    const { data, isLoading, refetch } = useGetJobDetailsQuery({ page: currentPage });
    const [deleteJobDetail] = useDeleteJobDetailMutation();
    const [updateJobDetail] = useUpdateJobDetailMutation();

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const mappedJobs: TableJob[] = useMemo(() => {
        if (!data?.data) return [];
        return data.data.map((job) => ({
            id: `JOB-${job.id.toString().padStart(4, "0")}`,
            title: job.job_title,
            level: job.job_level || "N/A",
            deadline: job.deadline || "N/A",
            vacancy: job.vacancy || "N/A",
            status: job.status === "active",
            originalId: job.id,
        }));
    }, [data]);

    const filteredJobs = useMemo(() => {
        let result = mappedJobs;

        if (searchQuery) {
            result = result.filter(
                (job) =>
                    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filter === "active") {
            result = result.filter((job) => job.status);
        } else if (filter === "inactive") {
            result = result.filter((job) => !job.status);
        }

        return result;
    }, [searchQuery, filter, mappedJobs]);

    const pagination = {
        current_page: data?.pagination?.current_page || 1,
        last_page: data?.pagination?.total_page || 1,
        total: data?.pagination?.total_count || 0,
        per_page: data?.pagination?.per_page || 10,
    };

    const showingFrom = (pagination.current_page - 1) * pagination.per_page + 1;
    const showingTo = Math.min(pagination.current_page * pagination.per_page, pagination.total);

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedIds(filteredJobs.map((j) => j.id));
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

    const handleStatusChange = async (id: string, status: boolean) => {
        const job = mappedJobs.find((j) => j.id === id);
        if (!job) return;

        try {
            await updateJobDetail({
                id: job.originalId,
                data: { status: status ? "active" : "inactive" }
            }).unwrap();
            toast.success("Job status updated!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to update status.");
        }
    };

    const handleAction = (id: string, action: string) => {
        if (action === "delete") {
            setJobToDelete(id);
            setDeleteConfirmOpen(true);
        } else if (action === "view") {
            const job = data?.data.find(j => j.id === Number(id));
            if (job) {
                setSelectedJob(job);
                setViewModalOpen(true);
            }
        } else if (action === "edit") {
            navigate(`/admin/job-posts/edit/${id}`);
        }
    };

    const handleDelete = async () => {
        if (!jobToDelete) return;

        try {
            await deleteJobDetail(Number(jobToDelete)).unwrap();
            toast.success("Job deleted successfully!");
            setDeleteConfirmOpen(false);
            setJobToDelete(null);
            refetch();
        } catch (error) {
            console.error("Failed to delete job:", error);
            toast.error("Failed to delete job. Please try again.");
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
                    searchPlaceholder="Search jobs..."
                />
                <Button onClick={() => navigate("/admin/job-posts/new")}>Create Job Post</Button>
            </div>

            {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <JobTable
                        jobs={filteredJobs}
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onSelectOne={handleSelectOne}
                        onStatusChange={handleStatusChange}
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
                title="Delete Job Post"
                description="Are you sure you want to delete this job post? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />

            <JobPostDetailModal
                open={viewModalOpen}
                onOpenChange={setViewModalOpen}
                job={selectedJob}
            />
        </div>
    );
}
