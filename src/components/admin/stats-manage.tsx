"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Loader2, Plus, Pencil, Trash2, ShieldCheck, ToggleLeft, ToggleRight, Search, Activity } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetStatsListQuery,
  useCreateStatMutation,
  useUpdateStatMutation,
  useToggleStatActiveMutation,
  useDeleteStatMutation,
  type HomepageStat,
} from "@/services/homepageStatsApi";

type FormState = {
  title: string;
  short_description: string;
  count: string;
  status: "active" | "inactive";
};

const initialFormState: FormState = {
  title: "",
  short_description: "",
  count: "",
  status: "active",
};

export function StatsManage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVal, setSearchVal] = useState("");

  const { data, isLoading, refetch } = useGetStatsListQuery({
    search: searchVal,
  });

  const [createStat, { isLoading: creating }] = useCreateStatMutation();
  const [updateStat, { isLoading: updating }] = useUpdateStatMutation();
  const [toggleStatActive, { isLoading: toggling }] = useToggleStatActiveMutation();
  const [deleteStat, { isLoading: deleting }] = useDeleteStatMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const stats = data?.data ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    if (!dialogOpen) {
      setFormState(initialFormState);
      setEditingId(null);
    }
  }, [dialogOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchVal(searchQuery);
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setFormState(initialFormState);
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: HomepageStat) => {
    setFormState({
      title: item.title ?? "",
      short_description: item.short_description ?? "",
      count: item.count,
      status: item.status ?? "active",
    });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleStatActive(id).unwrap();
      toast.success("Stat status toggled successfully.");
      refetch();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      toast.error("Failed to toggle status.");
    }
  };

  const handleSubmit = async () => {
    if (!formState.count) {
      toast.error("Count value is required (e.g. '50+', '100%').");
      return;
    }

    try {
      if (editingId) {
        await updateStat({ id: editingId, data: formState }).unwrap();
        toast.success("Homepage stat updated successfully.");
      } else {
        await createStat(formState).unwrap();
        toast.success("Homepage stat created successfully.");
      }
      setDialogOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to save homepage stat:", err);
      toast.error("Failed to save homepage stat. Please try again.");
    }
  };

  const confirmDelete = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteStat(pendingDeleteId).unwrap();
      toast.success("Homepage stat deleted.");
      setPendingDeleteId(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete stat:", err);
      toast.error("Failed to delete homepage stat. Please try again.");
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
    <div className="mt-10 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0B1B3D]">Homepage Statistics</h2>
          <p className="text-sm text-gray-500">Manage number stats shown on the public landing page hero/banner.</p>
        </div>
        <Button onClick={handleOpenCreate} className="inline-flex items-center gap-2 bg-[#0B1B3D] hover:bg-[#0B1B3D]/95">
          <Plus className="w-4 h-4" />
          Add New Stat
        </Button>
      </div>

      {/* Filter / Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search stats by title..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {/* Stats List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-6 h-6 mr-2 animate-spin text-primary" />
            Loading stats...
          </div>
        ) : stats.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-500">
            No homepage statistics found.
          </div>
        ) : (
          stats.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                    item.status === "active"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}>
                    {item.status ?? "inactive"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <div className="text-4xl font-extrabold text-[#0B1B3D] tracking-tight">
                  {item.count}
                </div>
                <CardTitle className="text-lg leading-tight text-gray-900 font-bold">{item.title || "Untitled Stat"}</CardTitle>
                {item.short_description && (
                  <p className="text-sm text-gray-600 font-medium leading-normal">{item.short_description}</p>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-gray-50 pt-4 pb-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)}>
                    <Pencil className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-700 hover:bg-gray-50"
                    onClick={() => handleToggleActive(item.id)}
                    disabled={toggling}
                  >
                    {item.status === "active" ? (
                      <>
                        <ToggleRight className="w-4 h-4 mr-1.5 text-green-600" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 mr-1.5 text-gray-400" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => confirmDelete(item.id)}
                  disabled={deleting && pendingDeleteId === item.id}
                >
                  {deleting && pendingDeleteId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {pagination && pagination.total_pages > 1 && (
        <DataTablePagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          totalEntries={pagination.total}
          entriesPerPage={pagination.per_page}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
          showingFrom={showingFrom}
          showingTo={showingTo}
        />
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0B1B3D]">
              {editingId ? "Edit Homepage Stat" : "Add Homepage Stat"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="count" className="font-bold text-gray-700">Count Value (Required)</Label>
              <Input
                id="count"
                value={formState.count}
                onChange={(e) => setFormState((prev) => ({ ...prev, count: e.target.value }))}
                placeholder="e.g. 50+, 10K+, 99%"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold text-gray-700">Title</Label>
              <Input
                id="title"
                value={formState.title}
                onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Expert Doctors, Satisfied Patients"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description" className="font-bold text-gray-700">Short Description</Label>
              <Textarea
                id="short_description"
                value={formState.short_description}
                onChange={(e) => setFormState((prev) => ({ ...prev, short_description: e.target.value }))}
                placeholder="Briefly describe what this stat represents"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="font-bold text-gray-700">Status</Label>
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
            <Button onClick={handleSubmit} disabled={creating || updating} className="bg-[#0B1B3D] hover:bg-[#0B1B3D]/95">
              {(creating || updating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? "Update Stat" : "Create Stat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        title="Delete Homepage Stat?"
        description="This will permanently delete this statistic from the landing page database. This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
