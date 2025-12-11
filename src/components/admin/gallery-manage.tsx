"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Loader2, Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetGalleriesQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
  type GalleryItem,
} from "@/services/galleryApi";

type FormState = {
  title: string;
  date: string;
  image?: File | string;
  status: "active" | "inactive";
};

const initialFormState: FormState = {
  title: "",
  date: "",
  status: "active",
};

export function GalleryManage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch, } = useGetGalleriesQuery(currentPage);

  const [createGallery, { isLoading: creating }] = useCreateGalleryMutation();
  const [updateGallery, { isLoading: updating }] = useUpdateGalleryMutation();
  const [deleteGallery, { isLoading: deleting }] = useDeleteGalleryMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const galleries = data?.data ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    if (!dialogOpen) {
      setFormState(initialFormState);
      setEditingId(null);
      setImagePreview(null);
    }
  }, [dialogOpen]);

  const handleOpenCreate = () => {
    setFormState(initialFormState);
    setEditingId(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setFormState({
      title: item.title,
      date: item.date,
      status: item.status,
      image: undefined,
    });
    setEditingId(item.id);
    setImagePreview(item.image);
    setDialogOpen(true);
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setFormState((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!formState.title || !formState.date) {
      toast.error("Title and date are required.");
      return;
    }

    try {
      if (editingId) {
        await updateGallery({ id: editingId, data: formState }).unwrap();
        toast.success("Gallery updated successfully.");
      } else {
        await createGallery(formState).unwrap();
        toast.success("Gallery created successfully.");
      }
      setDialogOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to save gallery:", err);
      toast.error("Failed to save gallery. Please try again.");
    }
  };

  const confirmDelete = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteGallery(pendingDeleteId).unwrap();
      toast.success("Gallery deleted.");
      setPendingDeleteId(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete gallery:", err);
      toast.error("Failed to delete gallery. Please try again.");
    }
  };

  const totalPages = pagination?.total_page ?? 1;
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
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gallery Items</h2>
        <Button onClick={handleOpenCreate} className="inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Gallery
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading galleries...
          </div>
        ) : galleries.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No gallery items found.
          </div>
        ) : (
          galleries.map((item) => (
            <Card key={item.id} className="flex flex-col overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative h-48 bg-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/vite.svg";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}
                  <span className="absolute top-2 right-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium">
                    {item.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-1 pt-4">
                <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                <CardTitle className="text-lg leading-tight line-clamp-2">{item.title}</CardTitle>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)}>
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDelete(item.id)}
                  disabled={deleting && pendingDeleteId === item.id}
                >
                  {deleting && pendingDeleteId === item.id ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-1" />
                  )}
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {pagination && pagination.total_page > 1 && (
        <DataTablePagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_page}
          totalEntries={pagination.total_count}
          entriesPerPage={pagination.per_page}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
          showingFrom={showingFrom}
          showingTo={showingTo}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Gallery" : "Add Gallery"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formState.title}
                onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formState.date}
                onChange={(e) => setFormState((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
              {imagePreview && (
                <div className="h-32 w-full overflow-hidden rounded border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vite.svg";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formState.status}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, status: e.target.value as "active" | "inactive" }))
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={creating || updating}>
              {(creating || updating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        title="Delete gallery?"
        description="This will permanently remove the gallery item."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}


