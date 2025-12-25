"use client";

import { useEffect, useState, startTransition } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Loader2, MapPin, Phone, Mail, Plus, Pencil, Trash2, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  type BranchItem,
} from "@/services/contactPageApi";
import { Badge } from "../ui/badge";

type FormState = {
  name: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  is_main: number;
};

const initialState: FormState = {
  name: "",
  address: "",
  phone: "",
  email: "",
  status: "active",
  is_main: 0,
};

export function BranchManage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetBranchesQuery(page);

  const [createBranch, { isLoading: creating }] = useCreateBranchMutation();
  const [updateBranch, { isLoading: updating }] = useUpdateBranchMutation();
  const [deleteBranch, { isLoading: deleting }] = useDeleteBranchMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const branches = data?.data ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    if (!dialogOpen) {
      startTransition(() => {
        setFormState(initialState);
        setEditingId(null);
      });
    }
  }, [dialogOpen]);

  const handleOpenCreate = () => {
    setFormState(initialState);
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: BranchItem) => {
    setFormState({
      name: item.name,
      address: item.address,
      phone: item.phone,
      email: item.email,
      status: item.status,
      is_main: item.is_main ?? 0,
    });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formState.name || !formState.address || !formState.phone || !formState.email) {
      toast.error("All fields are required.");
      return;
    }

    try {
      if (editingId) {
        await updateBranch({ id: editingId, data: formState }).unwrap();
        toast.success("Branch updated.");
      } else {
        await createBranch(formState).unwrap();
        toast.success("Branch created.");
      }
      setDialogOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to save branch:", err);
      toast.error("Failed to save branch. Please try again.");
    }
  };

  const confirmDelete = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteBranch(pendingDeleteId).unwrap();
      toast.success("Branch deleted.");
      setPendingDeleteId(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete branch:", err);
      toast.error("Failed to delete branch.");
    }
  };

  const showingFrom = pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
  const showingTo = pagination
    ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
    : 0;

  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Branches
        </h2>
        <Button onClick={handleOpenCreate} className="inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading branches...
          </div>
        ) : branches.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">No branches found.</div>
        ) : (
          branches.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Badge variant={item.is_main === 1 ? "default" : item.status === "active" ? "secondary" : "destructive"}>
                  {item.is_main === 1 ? "Main Branch" : item.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-sm px-6 py-2">
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{item.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4" />
                  <span>{item.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  <span>{item.email}</span>
                </div>
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
          onPageChange={setPage}
          showingFrom={showingFrom}
          showingTo={showingTo}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Branch" : "Add Branch"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                value={formState.name}
                onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Input
                value={formState.address}
                onChange={(e) => setFormState((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                value={formState.phone}
                onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <select
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
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formState.is_main === 1}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, is_main: e.target.checked ? 1 : 0 }))
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                Set as Main Branch
              </Label>
              {formState.is_main === 1 && editingId && (
                <p className="text-xs text-amber-600">
                  Note: Setting this branch as main will update other branches automatically.
                </p>
              )}
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
        title="Delete branch?"
        description="This will permanently remove the branch."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}


