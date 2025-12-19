"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { InvestorTable, type Investor as TableInvestor } from "@/components/admin/investor-table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetInvestorsQuery, useDeleteInvestorMutation, type Investor } from "@/services/investorApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import toast from "react-hot-toast";

export default function InvestorPage() {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [investorToDelete, setInvestorToDelete] = useState<string | null>(null);
    const [actionInvestorId, setActionInvestorId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<string | null>(null);

    const { data, isLoading, refetch } = useGetInvestorsQuery(currentPage);
    const [deleteInvestor] = useDeleteInvestorMutation();

    // Map API investors to table format
    const mappedInvestors: TableInvestor[] = useMemo(() => {
        if (!data?.data) return [];
        return data.data.map((investor: Investor) => ({
            id: investor.investor_identity_number,
            image: investor.image || undefined,
            name: investor.investor_name,
            email: investor.email_address,
            mobile: investor.mobile_number,
            status: true, // Default to true, can be updated if API provides status
        }));
    }, [data]);

    // Filter and search investors
    const filteredInvestors = useMemo(() => {
        let result = mappedInvestors;

        // Apply search
        if (searchQuery) {
            result = result.filter(
                (investor) =>
                    investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    investor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    investor.mobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    investor.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply filter
        if (filter === "active") {
            result = result.filter((investor) => investor.status);
        } else if (filter === "inactive") {
            result = result.filter((investor) => !investor.status);
        }

        return result;
    }, [searchQuery, filter, mappedInvestors]);

    const pagination = data?.pagination;
    const totalPages = pagination?.total_page || 1;
    const showingFrom = pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
    const showingTo = pagination
        ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
        : 0;

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedIds(filteredInvestors.map((i) => i.id));
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
        setActionInvestorId(id);
        setActionType(action);
        
        if (action === "delete") {
            setInvestorToDelete(id);
            setDeleteConfirmOpen(true);
        } else if (action === "edit") {
            const investor = data?.data?.find((i: Investor) => i.investor_identity_number === id);
            if (investor) {
                navigate(`/admin/investor/edit/${investor.id}`);
            }
        } else if (action === "view") {
            const investor = data?.data?.find((i: Investor) => i.investor_identity_number === id);
            if (investor) {
                navigate(`/admin/investor/view/${investor.id}`);
            }
        }
    };

    const handleDelete = async () => {
        if (!investorToDelete) return;
        
        const investor = data?.data?.find((i: Investor) => i.investor_identity_number === investorToDelete);
        if (!investor) return;

        try {
            await deleteInvestor(investor.id).unwrap();
            toast.success("Investor deleted successfully!");
            setDeleteConfirmOpen(false);
            setInvestorToDelete(null);
            refetch();
        } catch (error) {
            console.error("Failed to delete investor:", error);
            toast.error("Failed to delete investor. Please try again.");
        }
    };

    const handleBulkAction = (action: string) => {
        console.log(`Bulk action: ${action}`, selectedIds);
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Investor</h1>
                    <p className="text-gray-600">Here's what happening in your update</p>
                </div>
                <Button onClick={() => navigate("/admin/investor/new")}>Add New</Button>
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
                    <InvestorTable
                        investors={filteredInvestors}
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
                title="Delete Investor"
                description="Are you sure you want to delete this investor? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}

