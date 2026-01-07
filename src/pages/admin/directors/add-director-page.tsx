"use client";

import { useEffect, useState, startTransition } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useCreateDirectorMutation,
  useUpdateDirectorMutation,
  useGetDirectorByIdQuery,
} from "@/services/directorApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

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

export default function AddDirectorPage() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const directorId = params.id ? parseInt(params.id) : null;
  const pathname = window.location.pathname;
  const isViewMode = pathname.includes("/view/");
  const isEditMode = pathname.includes("/edit/");
  const isCreateMode = !directorId && !isEditMode && !isViewMode;

  const { data: directorData, isLoading } = useGetDirectorByIdQuery(directorId!, {
    skip: !directorId,
  });
  const [createDirector, { isLoading: isCreating }] = useCreateDirectorMutation();
  const [updateDirector, { isLoading: isUpdating }] = useUpdateDirectorMutation();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    special_message: "",
    message: "",
    status: "inactive" as "active" | "inactive",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  useEffect(() => {
    if (directorData?.data && directorId && !hasLoadedData) {
      const director = directorData.data;
      startTransition(() => {
        const normalizedStatus =
          director.status === "active" ? "active" : "inactive";

        setFormData({
          name: director.name || "",
          designation: director.designation || "",
          special_message: director.special_message || "",
          message: director.message || "",
          status: normalizedStatus,
        });
        if (director.photo) {
          setPhotoPreview(director.photo);
        }
        setHasLoadedData(true);
      });
    }
  }, [directorData, directorId, hasLoadedData]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.designation.trim()) {
      toast.error("Name and designation are required");
      return;
    }

    try {
      if (isEditMode && directorId) {
        await updateDirector({
          id: directorId,
          data: {
            name: formData.name,
            designation: formData.designation,
            special_message: formData.special_message || null,
            message: formData.message || null,
            status: formData.status,
            photo: photoFile || undefined,
          },
        }).unwrap();
        toast.success("Director updated successfully");
      } else {
        await createDirector({
          name: formData.name,
          designation: formData.designation,
          special_message: formData.special_message || null,
          message: formData.message || null,
          status: formData.status,
          photo: photoFile || undefined,
        }).unwrap();
        toast.success("Director created successfully");
      }
      navigate("/admin/directors");
    } catch (error) {
      console.error("Failed to submit director:", error);
      toast.error("Failed to save director. Please check the form and try again.");
    }
  };

  const readOnlyProps = isViewMode
    ? {
        readOnly: true,
        disabled: true,
      }
    : {};

  return (
    <div className="container w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/directors")}
            className="mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Directors
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isCreateMode ? "Create Director" : isEditMode ? "Edit Director" : "View Director"}
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full"
      >
        {isLoading && !isCreateMode ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter name"
                  {...readOnlyProps}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange("designation", e.target.value)}
                  placeholder="Enter designation"
                  {...readOnlyProps}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="special_message">Special Message</Label>
                <Textarea
                  id="special_message"
                  value={formData.special_message}
                  onChange={(e) => handleInputChange("special_message", e.target.value)}
                  placeholder="Short highlighted message"
                  rows={3}
                  {...readOnlyProps}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="message">Description</Label>
                <div className="bg-white">
                  <ReactQuill
                    theme="snow"
                    value={formData.message}
                    onChange={(value) => handleInputChange("message", value)}
                    modules={quillModules}
                    formats={quillFormats}
                    readOnly={isViewMode}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value as "active" | "inactive")
                  }
                  disabled={isViewMode}
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

              <div className="space-y-2">
                <Label htmlFor="photo">Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={isViewMode}
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="mt-2 w-28 h-32 object-cover rounded-md border"
                  />
                )}
              </div>
            </div>

            {!isViewMode && (
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/directors")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isCreateMode ? "Create Director" : "Update Director"}
                </Button>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}
