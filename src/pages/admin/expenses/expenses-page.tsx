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
  Calendar,
  Pencil,
  Trash2,
  Eye,
  FileImage,
  Filter,
} from "lucide-react";
import { useGetExpensesQuery, useDeleteExpenseMutation } from "@/services/expenseApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import toast from "react-hot-toast";

export default function ExpensesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVal, setSearchVal] = useState("");
  
  // Filters
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  
  // Dialog State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

  // Build query params
  const queryParams: any = {
    page: currentPage,
  };
  if (searchVal) queryParams.search = searchVal;
  if (timeFilter !== "all") queryParams.filter = timeFilter;
  if (fromDate) queryParams.from_date = fromDate;
  if (toDate) queryParams.to_date = toDate;

  const { data, isLoading, refetch } = useGetExpensesQuery(queryParams);
  const [deleteExpense] = useDeleteExpenseMutation();

  const expenses = data?.data ?? [];
  const pagination = data?.pagination;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchVal(searchQuery);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchVal("");
    setTimeFilter("all");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const confirmDelete = (id: number) => {
    setExpenseToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await deleteExpense(expenseToDelete).unwrap();
      toast.success("Expense deleted successfully.");
      setExpenseToDelete(null);
      setDeleteConfirmOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to delete expense:", err);
      toast.error("Failed to delete expense. Please try again.");
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
          <h1 className="text-3xl font-extrabold text-[#0B1B3D]">Expense Management</h1>
          <p className="text-sm text-gray-500">Track and filter company receipts and expenditures.</p>
        </div>
        <Button
          onClick={() => navigate("/accounting/software/expenses/new")}
          className="bg-[#0B1B3D] hover:bg-[#0B1B3D]/95 text-white inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Expense
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
                placeholder="Search by expense name or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Time Filter */}
          <div className="space-y-1.5">
            <Label htmlFor="timeFilter" className="text-xs font-bold text-gray-600">Quick Filter</Label>
            <select
              id="timeFilter"
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_year">This Year</option>
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

        {/* Date range filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-50">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> From Date
            </Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> To Date
            </Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#0B1B3D]" />
          <p className="text-sm text-gray-500 font-medium">Fetching expenses list...</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 px-6 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0B1B3D]">No Expenses Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query, selecting another timeframe, or create a new expense record.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Expense Details</th>
                  <th className="px-6 py-4">Receipts</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                      {new Date(expense.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    
                    {/* Details */}
                    <td className="px-6 py-4 max-w-md">
                      <div className="font-bold text-[#0B1B3D] text-base">{expense.name}</div>
                      {expense.description && (
                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{expense.description}</p>
                      )}
                    </td>

                    {/* Receipts */}
                    <td className="px-6 py-4">
                      {expense.images && expense.images.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {expense.images.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => window.open(img, "_blank")}
                              className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 group hover:opacity-90 transition-opacity"
                            >
                              <img
                                src={img}
                                alt={`Receipt ${i + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-3.5 h-3.5 text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs flex items-center gap-1.5">
                          <FileImage className="w-4 h-4" /> No Receipt
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/accounting/software/expenses/view/${expense.id}`)}
                          className="h-8 w-8 text-gray-500 hover:text-gray-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/accounting/software/expenses/edit/${expense.id}`)}
                          className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(expense.id)}
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
        title="Delete Expense Record?"
        description="This will permanently delete this expense and remove all uploaded receipts. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
