"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { InstallmentRulesTable, type InstallmentRule as TableInstallmentRule } from "@/components/admin/installment-rules-table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetInstallmentRulesQuery, useDeleteInstallmentRuleMutation, type InstallmentRule } from "@/services/installmentRulesApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import toast from "react-hot-toast";

export default function InstallmentRulesPage() {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

    const { data, isLoading, refetch } = useGetInstallmentRulesQuery(currentPage);
    const [deleteInstallmentRule] = useDeleteInstallmentRuleMutation();

    // Map API rules to table format
    const mappedRules: TableInstallmentRule[] = useMemo(() => {
        if (!data?.data) return [];
        return data.data.map((rule: InstallmentRule) => ({
            id: rule.id.toString(),
            ruleId: rule.id,
            name: rule.name || "N/A",
            payment_type: rule.payment_type || "N/A",
            regular_price: rule.regular_price || "0",
            offer_price: rule.offer_price || "0",
            emi_amount: rule.emi_amount || "0",
            duration_months: rule.duration_months || "0",
            status: rule.status === "active" || rule.status === "1",
        }));
    }, [data]);

    // Filter and search rules
    const filteredRules = useMemo(() => {
        let result = mappedRules;

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (rule) =>
                    (rule.name || "").toLowerCase().includes(query) ||
                    (rule.payment_type || "").toLowerCase().includes(query) ||
                    (rule.regular_price || "").includes(query) ||
                    (rule.offer_price || "").includes(query)
            );
        }

        // Apply filter
        if (filter === "active") {
            result = result.filter((rule) => rule.status);
        } else if (filter === "inactive") {
            result = result.filter((rule) => !rule.status);
        }

        return result;
    }, [searchQuery, filter, mappedRules]);

    const pagination = data?.pagination;
    const showingFrom = pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
    const showingTo = pagination
        ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
        : 0;

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedIds(filteredRules.map((r) => r.id));
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
        const rule = mappedRules.find((r) => r.id === id);
        
        if (action === "delete") {
            setRuleToDelete(id);
            setDeleteConfirmOpen(true);
        } else if (action === "edit") {
            if (rule?.ruleId) {
                navigate(`/admin/installment-rules/edit/${rule.ruleId}`);
            } else {
                toast.error("Rule not found");
            }
        } else if (action === "view") {
            if (rule?.ruleId) {
                navigate(`/admin/installment-rules/view/${rule.ruleId}`);
            } else {
                toast.error("Rule not found");
            }
        }
    };

    const handleDelete = async () => {
        if (!ruleToDelete) return;
        
        const mappedRule = mappedRules.find((r) => r.id === ruleToDelete);
        
        if (!mappedRule?.ruleId) {
            toast.error("Rule not found");
            setDeleteConfirmOpen(false);
            setRuleToDelete(null);
            return;
        }

        try {
            await deleteInstallmentRule(mappedRule.ruleId).unwrap();
            toast.success("Installment rule deleted successfully!");
            setDeleteConfirmOpen(false);
            setRuleToDelete(null);
            refetch();
        } catch (error) {
            console.error("Failed to delete installment rule:", error);
            toast.error("Failed to delete installment rule. Please try again.");
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Installment Rules</h1>
                    <p className="text-gray-600">Manage installment payment plans</p>
                </div>
                <Button onClick={() => navigate("/admin/installment-rules/new")}>Add New</Button>
            </div>

            {/* Filters */}
            <DataTableFilters
                onBulkAction={handleBulkAction}
                onFilterChange={handleFilterChange}
                onSearch={setSearchQuery}
                searchPlaceholder="Search rules..."
            />

            {/* Table */}
            {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <InstallmentRulesTable
                        rules={filteredRules}
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
                title="Delete Installment Rule"
                description="Are you sure you want to delete this installment rule? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}

