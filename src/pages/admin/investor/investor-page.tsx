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

    const { data, isLoading, refetch } = useGetInvestorsQuery(currentPage);
    const [deleteInvestor] = useDeleteInvestorMutation();

    // Map API investors to table format
    const mappedInvestors: TableInvestor[] = useMemo(() => {
        if (!data?.data) return [];
        return data.data.map((investor: Investor) => ({
            id: investor.id.toString(), // Use database ID as unique identifier
            investorId: investor.id, // Store the actual database ID
            image: investor.image || investor.applicant_image || undefined,
            applicant_full_name: investor.applicant_full_name || investor.investor_name || "N/A",
            email: ((investor as Investor & { email?: string }).email || investor.email_address) || "N/A",
            mobile: investor.mobile_number || "N/A",
            status: true, // Default to true, can be updated if API provides status
        }));
    }, [data]);

    // Filter and search investors
    const filteredInvestors = useMemo(() => {
        let result = mappedInvestors;

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (investor) =>
                    (investor.applicant_full_name || "").toLowerCase().includes(query) ||
                    (investor.email || "").toLowerCase().includes(query) ||
                    (investor.mobile || "").toLowerCase().includes(query) ||
                    (investor.id || "").toLowerCase().includes(query)
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
        // Find investor in mapped investors (works with filtered data too)
        const investor = mappedInvestors.find((i) => i.id === id);
        
        if (action === "delete") {
            setInvestorToDelete(id);
            setDeleteConfirmOpen(true);
        } else if (action === "edit") {
            if (investor?.investorId) {
                navigate(`/admin/investor/edit/${investor.investorId}`);
        } else {
            // Fallback: try to find in raw data by ID
            const rawInvestor = data?.data?.find((i: Investor) => i.id.toString() === id);
            if (rawInvestor) {
                navigate(`/admin/investor/edit/${rawInvestor.id}`);
            } else {
                toast.error("Investor not found");
            }
        }
    } else if (action === "view") {
        if (investor?.investorId) {
            navigate(`/admin/investor/view/${investor.investorId}`);
        } else {
            // Fallback: try to find in raw data by ID
            const rawInvestor = data?.data?.find((i: Investor) => i.id.toString() === id);
            if (rawInvestor) {
                navigate(`/admin/investor/view/${rawInvestor.id}`);
            } else {
                toast.error("Investor not found");
            }
        }
        }
    };

    const handleDelete = async () => {
        if (!investorToDelete) return;
        
        // Try to find in mapped investors first
        const mappedInvestor = mappedInvestors.find((i) => i.id === investorToDelete);
        let investor: Investor | undefined;
        
        if (mappedInvestor?.investorId) {
            // Find the raw investor data using the database ID
            investor = data?.data?.find((i: Investor) => i.id === mappedInvestor.investorId);
        } else {
            // Fallback: find by ID string
            investor = data?.data?.find((i: Investor) => i.id.toString() === investorToDelete);
        }
        
        if (!investor) {
            toast.error("Investor not found");
            setDeleteConfirmOpen(false);
            setInvestorToDelete(null);
            return;
        }

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

