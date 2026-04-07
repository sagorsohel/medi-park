"use client";

import { useState } from "react";
import {
  useGetOurValuesQuery,
  useCreateOurValueMutation,
  useUpdateOurValueMutation,
  useDeleteOurValueMutation,
  useSetOurValueActiveMutation,
  type OurValue
} from "@/services/ourValuesApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Plus, Trash2, Loader2, Save, X, Settings2, CheckCircle2, XCircle } from "lucide-react";
import { IconSelector } from "@/components/admin/icon-selector";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DynamicIcon } from "@/components/dynamic-icon";
import toast from "react-hot-toast";

export default function OurValuesManagePage() {
  const { data, isLoading, refetch } = useGetOurValuesQuery();
  const [createValue] = useCreateOurValueMutation();
  const [updateValue] = useUpdateOurValueMutation();
  const [deleteValue] = useDeleteOurValueMutation();
  const [setActive] = useSetOurValueActiveMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    icon: "",
    short_description: "",
    long_description: "",
    status: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      icon: "",
      short_description: "",
      long_description: "",
      status: true,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (value: OurValue) => {
    setFormData({
      title: value.title,
      icon: value.icon || "",
      short_description: value.short_description || "",
      long_description: value.long_description || "",
      status: Boolean(value.status),
    });
    setEditingId(value.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    try {
      if (editingId) {
        await updateValue({ id: editingId, data: { ...formData, status: formData.status ? 1 : 0 } }).unwrap();
        toast.success("Value updated successfully");
      } else {
        await createValue({ ...formData, status: formData.status ? 1 : 0 }).unwrap();
        toast.success("Value created successfully");
      }
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteValue(deleteId).unwrap();
      toast.success("Value deleted successfully");
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean | number) => {
    try {
      const newStatus = !Boolean(currentStatus);
      await setActive({ id, status: newStatus ? 1 : 0 }).unwrap();
      toast.success(`Value ${newStatus ? 'activated' : 'deactivated'} successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to toggle status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-outfit">Our Values</h1>
          <p className="text-gray-500 mt-1">Manage core values displayed on the website</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Value
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="mb-8 border-primary/20 p-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between">
            <CardTitle>{editingId ? "Edit Value" : "Create New Value"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6!">
            <form onSubmit={handleSubmit} className="space-y-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Field>
                    <FieldLabel>Value Title <span className="text-red-500">*</span></FieldLabel>
                    <FieldContent>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Integrity, Innovation"
                        required
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Short Description</FieldLabel>
                    <FieldContent>
                      <Textarea
                        value={formData.short_description}
                        onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                        placeholder="Brief summary of this value"
                        className="h-24"
                      />
                    </FieldContent>
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Value Icon</FieldLabel>
                  <FieldContent>
                    <IconSelector
                      value={formData.icon}
                      onChange={(icon) => setFormData({ ...formData, icon })}
                    />
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel>Long Description</FieldLabel>
                <FieldContent>
                  <Textarea
                    value={formData.long_description}
                    onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                    placeholder="Detailed explanation of what this value means to us"
                    className="h-32"
                  />
                </FieldContent>
              </Field>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="status"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Active Status
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" className="min-w-[120px]">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update Value" : "Create Value"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((value) => (
          <Card key={value.id} className="group border-l-6 border-l-primary! rounded-l-none! rounded-r-2xl! relative overflow-hidden transition-all hover:shadow-xl hover:border-primary/30 border-gray-200">
            {/* <div className={`absolute top-0 left-0 w-1 h-full ${Boolean(value.status) ? 'bg-primary' : 'bg-gray-300'}`} /> */}

            <CardHeader className="p-4!">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                  {value.icon ? <DynamicIcon name={value.icon} className="w-6 h-6" /> : <Settings2 className="w-6 h-6" />}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleEdit(value)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setDeleteId(value.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl font-bold">{value.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 p-4!">
              <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px]">
                {value.short_description || "No short description provided."}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${Boolean(value.status)
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                    }`}>
                    {Boolean(value.status) ? "Active" : "Inactive"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs h-8 px-3 rounded-full flex items-center gap-1.5 ${Boolean(value.status)
                    ? "text-red-600 hover:bg-red-50"
                    : "text-green-600 hover:bg-green-50"
                    }`}
                  onClick={() => handleToggleStatus(value.id, value.status)}
                >
                  {Boolean(value.status) ? (
                    <><XCircle className="h-3.5 w-3.5" /> Deactivate</>
                  ) : (
                    <><CheckCircle2 className="h-3.5 w-3.5" /> Activate</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!data?.data || data.data.length === 0) && (
          <div className="col-span-full py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium">No values added yet</p>
            <p className="text-sm">Click the button above to add your first core value.</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => !isDeleting && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Are you sure?"
        description="This action will permanently delete this value. This cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete Value"}
        variant="destructive"
      />
    </div>
  );
}
