"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Search,
  Calendar,
  Pencil,
  Trash2,
  Eye,
  Filter,
  Package,
} from "lucide-react";
import {
  useGetEquipmentPagesQuery,
  useDeleteEquipmentPageMutation,
  useToggleEquipmentPageActiveMutation,
  type EquipmentPageQueryParams,
} from "@/services/equipmentPageApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import toast from "react-hot-toast";

export default function EquipmentPagesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVal, setSearchVal] = useState("");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Dialog State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // Build query params
  const queryParams: EquipmentPageQueryParams = {
    page: currentPage,
  };
  if (searchVal) queryParams.search = searchVal;
  if (statusFilter !== "all") queryParams.status = statusFilter;

  const { data, isLoading, refetch } = useGetEquipmentPagesQuery(queryParams);
  const [deleteEquipmentPage] = useDeleteEquipmentPageMutation();
  const [toggleActive, { isLoading: isToggling }] = useToggleEquipmentPageActiveMutation();

  const records = data?.data ?? [];
  const pagination = data?.pagination;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchVal(searchQuery);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchVal("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const confirmDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteEquipmentPage(itemToDelete).unwrap();
      toast.success("Equipment page record deleted successfully.");
      setItemToDelete(null);
      setDeleteConfirmOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to delete record:", err);
      toast.error("Failed to delete record. Please try again.");
    }
  };

  const handleToggleActive = async (id: number) => {
    if (isToggling) return;
    try {
      await toggleActive(id).unwrap();
      toast.success("Active status updated successfully.");
      refetch();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      toast.error("Failed to update active status.");
    }
  };

  const showingFrom = pagination
    ? (pagination.current_page - 1) * pagination.per_page + 1
    : 0;
  const showingTo = pagination
    ? Math.min(
        pagination.current_page * pagination.per_page,
        pagination.total_count
      )
    : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B1B3D]">Equipment Pages</h1>
          <p className="text-sm text-gray-500">Track and manage hospital equipment pages, purchase orders, and assets.</p>
        </div>
        <Button
          onClick={() => navigate("/accounting/software/equipment-pages/new")}
          className="bg-[#0B1B3D] hover:bg-[#0B1B3D]/95 text-white inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Equipment Page
        </Button>
      </div>

      {/* Filter Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <Label htmlFor="search" className="text-xs font-bold text-gray-600">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="search"
                placeholder="Search by Title, Purchase No, Serial No..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <Label htmlFor="statusFilter" className="text-xs font-bold text-gray-600">Status</Label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-2">
            <Button type="submit" className="flex-1">Apply</Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear
            </Button>
          </div>
        </form>
      </div>

      {/* Main Content List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#0B1B3D]" />
          <p className="text-sm text-gray-500 font-medium">Fetching records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 px-6 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0B1B3D]">No Records Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query, selecting another status, or add a new equipment page.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Title & Purchase Info</th>
                  <th className="px-6 py-4">Equipment & Vendor</th>
                  <th className="px-6 py-4">Financials</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Active</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {records.map((record) => {
                  const totalPrice = (record.quantity ?? 0) * (record.unit_price ?? 0);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Title & Purchase Info */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0B1B3D] text-base">{record.title}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          No: <span className="font-semibold">{record.purchase_no}</span>
                        </div>
                        {record.purchase_date && (
                          <div className="text-gray-400 text-[11px] mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(record.purchase_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              })}
                          </div>
                        )}
                      </td>
                      
                      {/* Equipment & Vendor */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-gray-400" />
                          {record.equipment?.name || "Unknown Equipment"}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          Vendor: <span className="font-medium">{record.vendor?.company_name || "N/A"}</span>
                        </div>
                      </td>

                      {/* Financials */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">${totalPrice.toLocaleString()}</div>
                        <div className="text-gray-400 text-xs mt-0.5">
                          {record.quantity ?? 0} pcs @ ${(record.unit_price ?? 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={
                            (record.status || "inactive") === "active"
                              ? "bg-green-50 text-green-700 border-green-200 font-bold px-3 py-1"
                              : "bg-red-50 text-red-700 border-red-200 font-bold px-3 py-1"
                          }
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              (record.status || "inactive") === "active" ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {(record.status || "inactive").toUpperCase()}
                        </Badge>
                      </td>

                      {/* Active Toggle */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Switch
                          checked={Boolean(record.is_active)}
                          onCheckedChange={() => handleToggleActive(record.id)}
                          className="mx-auto"
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/accounting/software/equipment-pages/view/${record.id}`)}
                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/accounting/software/equipment-pages/edit/${record.id}`)}
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(record.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDelete}
        title="Delete Equipment Page?"
        description="This will permanently delete this equipment page and its purchase data. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
