"use client";

import { useState, useEffect, startTransition } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useGetFutureVentureByIdQuery,
  useUpdateFutureVentureMutation,
  type UpdateFutureVenturePayload,
} from "@/services/futureVenturesApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "color",
  "background",
  "align",
];

export default function EditFutureVenturePage() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const ventureId = params.id ? parseInt(params.id) : null;

  const { data: ventureData, isLoading } = useGetFutureVentureByIdQuery(ventureId!, {
    skip: !ventureId,
  });
  const [updateFutureVenture, { isLoading: isUpdating }] = useUpdateFutureVentureMutation();

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    status: "inactive" as "active" | "inactive",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Update form data when ventureData changes
  useEffect(() => {
    if (ventureData?.data && ventureId) {
      const venture = ventureData.data;
      startTransition(() => {
        setFormData({
          title: venture.title || "",
          short_description: venture.short_description || "",
          description: venture.description || "",
          status: venture.status || "inactive",
        });
        setImagePreview(venture.image || null);
      });
    }
  }, [ventureData?.data, ventureId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if description has actual text content (strip HTML tags)
    const descriptionText = formData.description.replace(/<[^>]*>/g, '').trim();

    if (!formData.title.trim() || !formData.short_description.trim() || !descriptionText) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!ventureId) {
      toast.error("Future Venture ID is missing");
      return;
    }

    try {
      const updatePayload: UpdateFutureVenturePayload = {
        title: formData.title,
        short_description: formData.short_description,
        description: formData.description,
        status: formData.status,
      };

      if (imageFile) {
        updatePayload.image = imageFile;
      }

      await updateFutureVenture({ id: ventureId, data: updatePayload }).unwrap();
      toast.success("Future Venture updated successfully!");
      navigate("/admin/future-ventures");
    } catch (error: unknown) {
      console.error("Failed to update future venture:", error);
      const errorMessage =
        (error &&
          typeof error === "object" &&
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data &&
          typeof error.data.message === "string")
          ? error.data.message
          : "Failed to update future venture. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!ventureData?.data) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-red-500">
          Future Venture not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/future-ventures")}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Future Ventures
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Future Venture</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              placeholder="Enter title"
            />
          </div>

          {/* Short Description */}
          <div className="md:col-span-2">
            <Label htmlFor="short_description">Short Description *</Label>
            <textarea
              id="short_description"
              value={formData.short_description}
              onChange={(e) => handleChange("short_description", e.target.value)}
              required
              placeholder="Enter short description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <div className="bg-white">
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) => handleChange("description", value)}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter description"
              />
            </div>
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <Label htmlFor="image">Image (Leave empty to keep current)</Label>
            <div className="space-y-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border"
                />
              )}
            </div>
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/future-ventures")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Future Venture"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
