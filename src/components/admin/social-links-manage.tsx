"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Loader2, Plus, Pencil, Trash2, ImageIcon, Link2, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetSocialLinksQuery,
  useCreateSocialLinkMutation,
  useUpdateSocialLinkMutation,
  useDeleteSocialLinkMutation,
  type SocialLinkItem,
} from "@/services/contactPageApi";

type FormState = {
  name: string;
  link: string;
  image?: File | string;
  status: "active" | "inactive";
};

const initialFormState: FormState = {
  name: "",
  link: "",
  status: "active",
};

export function SocialLinksManage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch } = useGetSocialLinksQuery(currentPage);

  const [createSocialLink, { isLoading: creating }] = useCreateSocialLinkMutation();
  const [updateSocialLink, { isLoading: updating }] = useUpdateSocialLinkMutation();
  const [deleteSocialLink, { isLoading: deleting }] = useDeleteSocialLinkMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const socialLinks = data?.data ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    if (!dialogOpen) {
      // Defer state updates to avoid synchronous setState in effect warning
      setTimeout(() => {
        setFormState(initialFormState);
        setEditingId(null);
        setImagePreview(null);
      }, 0);
    }
  }, [dialogOpen]);

  const handleOpenCreate = () => {
    setFormState(initialFormState);
    setEditingId(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: SocialLinkItem) => {
    setFormState({
      name: item.name,
      link: item.link,
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
    if (!formState.name || !formState.link) {
      toast.error("Name and link are required.");
      return;
    }

    // Validate URL format
    try {
      new URL(formState.link);
    } catch {
      toast.error("Please enter a valid URL.");
      return;
    }

    try {
      if (editingId) {
        await updateSocialLink({ id: editingId, data: formState }).unwrap();
        toast.success("Social link updated successfully.");
      } else {
        if (!formState.image || !(formState.image instanceof File)) {
          toast.error("Image is required when creating a new social link.");
          return;
        }
        await createSocialLink(formState).unwrap();
        toast.success("Social link created successfully.");
      }
      setDialogOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to save social link:", err);
      toast.error("Failed to save social link. Please try again.");
    }
  };

  const confirmDelete = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteSocialLink(pendingDeleteId).unwrap();
      toast.success("Social link deleted.");
      setPendingDeleteId(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete social link:", err);
      toast.error("Failed to delete social link. Please try again.");
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
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Social Links
        </h2>
        <Button onClick={handleOpenCreate} className="inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Social Link
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading social links...
          </div>
        ) : socialLinks.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No social links found.
          </div>
        ) : (
          socialLinks.map((item) => (
            <Card key={item.id} className="flex flex-col overflow-hidden">
              <CardHeader className="pb-2">
                <div className="relative h-32 w-full bg-gray-100 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-4"
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
              <CardContent className="flex-1 p-4">
                <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                  <Link2 className="w-4 h-4 shrink-0" />
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:text-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.link}
                  </a>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-3">
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
            <DialogTitle>{editingId ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formState.name}
                onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter social link name (e.g., Facebook, Twitter)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                type="url"
                value={formState.link}
                onChange={(e) => setFormState((prev) => ({ ...prev, link: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Icon Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*,.svg"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
              {imagePreview && (
                <div className="h-32 w-32 overflow-hidden rounded border bg-gray-50 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-contain p-2"
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
        title="Delete social link?"
        description="This will permanently remove the social link."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}

