"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  FileImage,
  Filter,
  Mail,
  Phone,
  MapPin,
  Tag,
} from "lucide-react";
import { useGetVendorsQuery, useDeleteVendorMutation } from "@/services/vendorApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import toast from "react-hot-toast";

export default function VendorsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVal, setSearchVal] = useState("");
  
  // Dialog State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<number | null>(null);

  // Build query params
  const queryParams: any = {
    page: currentPage,
  };
  if (searchVal) queryParams.search = searchVal;

  const { data, isLoading, refetch } = useGetVendorsQuery(queryParams);
  const [deleteVendor] = useDeleteVendorMutation();

  const vendors = data?.data ?? [];
  const pagination = data?.pagination;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchVal(searchQuery);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchVal("");
    setCurrentPage(1);
  };

  const confirmDelete = (id: number) => {
    setVendorToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!vendorToDelete) return;
    try {
      await deleteVendor(vendorToDelete).unwrap();
      toast.success("Vendor deleted successfully.");
      setVendorToDelete(null);
      setDeleteConfirmOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to delete vendor:", err);
      toast.error("Failed to delete vendor. Please try again.");
    }
  };

  const showingFrom = pagination
    ? (pagination.current_page - 1) * pagination.per_page + 1
    : 0;
  const showingTo = pagination
    ? Math.min(
        pagination.current_page * pagination.per_page,
        pagination.total
      )
    : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B1B3D]">Vendors Directory</h1>
          <p className="text-sm text-gray-500">Manage supply chain partners and materials inventory.</p>
        </div>
        <Button
          onClick={() => navigate("/accounting/software/vendors/new")}
          className="bg-[#0B1B3D] hover:bg-[#0B1B3D]/95 text-white inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Vendor
        </Button>
      </div>

      {/* Filter Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-end gap-4">
          {/* Keyword Search */}
          <div className="space-y-1.5 flex-1 w-full">
            <Label htmlFor="search" className="text-xs font-bold text-gray-600">Search Vendor</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="search"
                placeholder="Search by vendor name, materials, email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button type="submit" className="flex-1 sm:flex-none px-6">Search</Button>
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
          <p className="text-sm text-gray-500 font-medium">Fetching vendors list...</p>
        </div>
      ) : vendors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 px-6 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0B1B3D]">No Vendors Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query, or register a new vendor partner in your database.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Contact info</th>
                  <th className="px-6 py-4">Materials Supplied</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Company */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {vendor.company_image ? (
                          <button
                            type="button"
                            onClick={() => window.open(vendor.company_image!, "_blank")}
                            className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity"
                          >
                            <img
                              src={vendor.company_image}
                              alt={vendor.company_name}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                            <FileImage className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-[#0B1B3D] text-base">{vendor.company_name}</div>
                          {vendor.company_address && (
                            <div className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              {vendor.company_address}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Contacts */}
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs text-gray-600">
                        {vendor.company_email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{vendor.company_email}</span>
                          </div>
                        )}
                        {vendor.company_phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{vendor.company_phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Supply Materials */}
                    <td className="px-6 py-4">
                      {vendor.supply_materials && vendor.supply_materials.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {vendor.supply_materials.map((mat, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              <Tag className="w-3 h-3 text-blue-500" />
                              {mat}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          vendor.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/accounting/software/vendors/view/${vendor.id}`)}
                          className="h-8 w-8 text-gray-500 hover:text-gray-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/accounting/software/vendors/edit/${vendor.id}`)}
                          className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(vendor.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <DataTablePagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          totalEntries={pagination.total}
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
        title="Delete Vendor Profile?"
        description="This will permanently delete this vendor record and remove all stored supplier materials mappings. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
