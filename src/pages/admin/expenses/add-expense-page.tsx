"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Loader2,
  Trash2,
  Upload,
  Calendar,
  DollarSign,
  FileImage,
} from "lucide-react";
import {
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
} from "@/services/expenseApi";
import toast from "react-hot-toast";

export default function AddExpensePage() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const expenseId = params.id ? parseInt(params.id) : null;
  
  const pathname = window.location.pathname;
  const isViewMode = pathname.includes("/view/");
  const isEditMode = pathname.includes("/edit/");
  const isCreateMode = !expenseId && !isEditMode && !isViewMode;

  const { data: expenseData, isLoading } = useGetExpenseQuery(expenseId!, { skip: !expenseId });
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  
  // Files State
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Load existing expense data when editing or viewing
  useEffect(() => {
    if (expenseData?.data) {
      const exp = expenseData.data;
      setName(exp.name || "");
      setDescription(exp.description || "");
      setDate(exp.date || "");
      setExistingImages(exp.images || []);
    }
  }, [expenseData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFiles = Array.from(e.target.files || []);
    if (chosenFiles.length === 0) return;

    setFiles((prev) => [...prev, ...chosenFiles]);

    // Create object URLs for preview
    const previews = chosenFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveNewFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    // Revoke object URL
    URL.revokeObjectURL(filePreviews[index]);
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    // Note: If the backend has a way to remove specific images, we'd trigger it here.
    // For now, we update client preview representation.
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!name) {
      toast.error("Expense name is required.");
      return;
    }
    if (!date) {
      toast.error("Expense date is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("date", date);
      if (description) formData.append("description", description);

      // Append images
      files.forEach((file) => {
        formData.append("images[]", file);
      });

      // If editing, we also want to send the remaining existing images
      if (isEditMode) {
        existingImages.forEach((img) => {
          formData.append("existing_images[]", img);
        });
      }

      if (isEditMode && expenseId) {
        await updateExpense({ id: expenseId, formData }).unwrap();
        toast.success("Expense updated successfully!");
      } else {
        await createExpense(formData).unwrap();
        toast.success("Expense created successfully!");
      }
      
      navigate("/accounting/software/expenses");
    } catch (err: any) {
      console.error("Failed to save expense:", err);
      const msg = err?.data?.message || "Failed to save expense. Please verify the entries.";
      toast.error(msg);
    }
  };

  if (isLoading && expenseId) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B1B3D]" />
      </div>
    );
  }

  const readOnlyProps = isViewMode ? { readOnly: true, disabled: true } : {};

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl space-y-6">
      {/* Back & Title */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8 -ml-2 text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B1B3D]">
            {isCreateMode && "Add New Expense"}
            {isEditMode && "Edit Expense Details"}
            {isViewMode && "View Expense Record"}
          </h1>
          <p className="text-xs text-gray-500">
            {isCreateMode && "Enter new expense transactions and save receipts."}
            {isEditMode && "Update fields or replace uploaded receipt attachments."}
            {isViewMode && "Review uploaded description and invoice details."}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="font-bold text-gray-700">Expense Title / Item Name *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Office Rent, Cloud Server Subscription, Laptop Purchase"
              className="pl-10"
              required
              {...readOnlyProps}
            />
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="font-bold text-gray-700">Expense Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10"
              required
              {...readOnlyProps}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="font-bold text-gray-700">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add specific detail (e.g. Invoice #2938, Paid via company credit card)"
            rows={4}
            {...readOnlyProps}
          />
        </div>

        {/* Upload Receipts */}
        <div className="space-y-3">
          <Label className="font-bold text-gray-700">Receipt Images / Invoices</Label>
          
          {/* File Picker */}
          {!isViewMode && (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                <p className="text-sm font-semibold">Click to upload files or drag and drop</p>
                <p className="text-xs text-gray-400">Supported formats: JPEG, PNG, GIF (Max 20MB per file)</p>
              </div>
            </div>
          )}

          {/* New Previews list */}
          {filePreviews.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Uploads</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {filePreviews.map((preview, i) => (
                  <div key={i} className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={preview} alt="New Preview" className="w-full h-full object-cover" />
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={() => handleRemoveNewFile(i)}
                        className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Previews list */}
          {existingImages.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uploaded Receipts</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={img} alt="Existing attachment" className="w-full h-full object-cover" />
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(i)}
                        className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty files view */}
          {filePreviews.length === 0 && existingImages.length === 0 && (
            <div className="text-gray-400 text-xs py-2 flex items-center gap-1.5 justify-center border border-gray-50 rounded-xl bg-gray-50/50">
              <FileImage className="w-4 h-4" /> No receipts uploaded
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/accounting/software/expenses")}
          >
            {isViewMode ? "Go Back" : "Cancel"}
          </Button>
          {!isViewMode && (
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-[#0B1B3D] hover:bg-[#0B1B3D]/95 text-white flex items-center gap-2 min-w-[120px]"
            >
              {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditMode ? "Update Expense" : "Create Expense"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
