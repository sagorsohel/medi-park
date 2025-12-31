"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useGetFutureVenturesQuery,
  useDeleteFutureVentureMutation,
} from "@/services/futureVenturesApi";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit2, Trash2, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import toast from "react-hot-toast";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FutureVenturesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useGetFutureVenturesQuery(page);
  const [deleteFutureVenture] = useDeleteFutureVentureMutation();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [ventureToDelete, setVentureToDelete] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!ventureToDelete) return;

    try {
      await deleteFutureVenture(ventureToDelete).unwrap();
      toast.success("Future Venture deleted successfully!");
      setDeleteConfirmOpen(false);
      setVentureToDelete(null);
      refetch();
    } catch (err) {
      toast.error("Failed to delete future venture.");
      console.error("Failed to delete future venture:", err);
    }
  };

  const handleAction = (id: number, action: string) => {
    if (action === "delete") {
      setVentureToDelete(id);
      setDeleteConfirmOpen(true);
    } else if (action === "edit") {
      navigate(`/admin/future-ventures/edit/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-red-500">
          Error: {JSON.stringify(error)}
        </div>
      </div>
    );
  }

  const futureVentures = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Future Ventures</h1>
          <p className="text-gray-600">Manage future ventures</p>
        </div>
        <Button onClick={() => navigate("/admin/future-ventures/add")}>
          <PlusCircle className="mr-2 h-5 w-5" /> Add Future Venture
        </Button>
      </div>

      {futureVentures.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          No future ventures found. Click "Add Future Venture" to create one.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {futureVentures.map((venture) => (
              <Card
                key={venture.id}
                className={`border ${venture.status === "active"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
                  }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg line-clamp-1">{venture.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(venture.id, "edit")}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleAction(venture.id, "delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {venture.image && (
                    <img
                      src={venture.image}
                      alt={venture.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {venture.short_description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        venture.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {venture.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination && (
            <DataTablePagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_page}
              totalEntries={pagination.total_count}
              entriesPerPage={pagination.per_page}
              onPageChange={setPage}
            />
          )}

          <ConfirmDialog
            open={deleteConfirmOpen}
            onOpenChange={setDeleteConfirmOpen}
            onConfirm={handleDelete}
            title="Delete Future Venture"
            description="Are you sure you want to delete this future venture? This action cannot be undone."
          />
        </>
      )}
    </div>
  );
}
