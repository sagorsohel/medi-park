"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  useGetDirectorsQuery,
  useDeleteDirectorMutation,
  type Director,
} from "@/services/directorApi";
import toast from "react-hot-toast";

export default function DirectorsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [directorToDelete, setDirectorToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch } = useGetDirectorsQuery({ page: currentPage });
  const [deleteDirector, { isLoading: isDeleting }] = useDeleteDirectorMutation();

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const directors: Director[] = useMemo(() => data?.data ?? [], [data]);
  const pagination = data?.pagination;

  const handleDeleteClick = (id: number) => {
    setDirectorToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!directorToDelete) return;
    try {
      await deleteDirector(directorToDelete).unwrap();
      toast.success("Director deleted successfully");
      setDeleteConfirmOpen(false);
      setDirectorToDelete(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete director:", error);
      toast.error("Failed to delete director. Please try again.");
    }
  };

  const showingFrom = pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
  const showingTo = pagination
    ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
    : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Directors</h1>
          <p className="text-gray-600">Manage Board of Directors information for the website.</p>
        </div>
        <Button onClick={() => navigate("/admin/directors/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : directors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No directors found.</p>
          <Button onClick={() => navigate("/admin/directors/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Director
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {directors.map((director) => (
            <Card key={director.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                  {director.name || "Untitled"}
                </CardTitle>
                <Badge
                  variant={director.status === "active" ? "default" : "outline"}
                  className={
                    director.status === "active"
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "border-gray-300 text-gray-600"
                  }
                >
                  {director.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-4 gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-24 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center border">
                    {director.photo ? (
                      <img
                        src={director.photo}
                        alt={director.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 text-center px-2">
                        No Photo
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium">
                      {director.designation || "Designation not set"}
                    </p>
                    {director.special_message && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-3">
                        {director.special_message}
                      </p>
                    )}
                  </div>
                </div>
                {director.message && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {director.message}
                  </p>
                )}
                <div className="mt-4 flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/admin/directors/edit/${director.id}`)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />

                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteClick(director.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />

                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
        onConfirm={handleDeleteConfirm}
        title="Delete Director"
        description="Are you sure you want to delete this director? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}

