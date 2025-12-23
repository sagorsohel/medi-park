"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Loader2, RefreshCw } from "lucide-react";
import { useGetWhoWeAreQuery, useUpdateWhoWeAreMutation, type UpdateWhoWeArePayload } from "@/services/aboutPageApi";
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

interface EditableState {
  title: string;
  paragraph: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  imageFile1?: File;
  imageFile2?: File;
  imageFile3?: File;
  status: "active" | "inactive";
}

export function WhoWeAreManage() {
  const { data, isLoading, error, refetch } = useGetWhoWeAreQuery();
  const [updateWhoWeAre] = useUpdateWhoWeAreMutation();
  const [saving, setSaving] = useState(false);
  const [editable, setEditable] = useState<EditableState | null>(null);

  const record = useMemo(() => data?.data, [data]);

  // Initialize editable state when data loads
  useEffect(() => {
    if (record) {
      setEditable({
        title: record.title ?? "",
        paragraph: record.paragraph ?? "",
        image_1: record.image_1 ?? "",
        image_2: record.image_2 ?? "",
        image_3: record.image_3 ?? "",
        status: record.status ?? "inactive",
      });
    }
  }, [record]);

  const handleFileChange = (key: "imageFile1" | "imageFile2" | "imageFile3", file: File | null) => {
    if (!editable) return;
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEditable((prev) =>
      prev
        ? {
            ...prev,
            [key]: file,
            ...(key === "imageFile1" ? { image_1: url } : {}),
            ...(key === "imageFile2" ? { image_2: url } : {}),
            ...(key === "imageFile3" ? { image_3: url } : {}),
          }
        : prev,
    );
  };

  const handleChange = (field: keyof EditableState, value: string) => {
    if (!editable) return;
    setEditable((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!record || !editable) return;
    setSaving(true);
    try {
      const payload: UpdateWhoWeArePayload = {};
      if (editable.title !== record.title) payload.title = editable.title;
      if (editable.paragraph !== record.paragraph) payload.paragraph = editable.paragraph;
      if (editable.status !== record.status) payload.status = editable.status;
      if (editable.imageFile1) payload.image_1 = editable.imageFile1;
      if (editable.imageFile2) payload.image_2 = editable.imageFile2;
      if (editable.imageFile3) payload.image_3 = editable.imageFile3;

      await updateWhoWeAre({ id: record.id, data: payload }).unwrap();
      await refetch();
    } catch (err) {
      console.error("Failed to update Who We Are section:", err);
      alert("Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !record || !editable) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load Who We Are section. Please try again.</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-10 pt-8">
      <div className="p-5 ">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Who We Are Section</h2>
        <p className="text-gray-600">Manage the About page hero ("Who We Are") content.</p>
      </div>

      <Card>
        <CardHeader className="bg-primary/30 rounded-t-lg flex flex-row items-center justify-between">
          <CardTitle>Content</CardTitle>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Save Changes
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 p-6">
          {/* Preview similar to website section */}
          <div className="relative w-full bg-primary py-10 rounded-xl overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
                {[editable.image_1, editable.image_2, editable.image_3].map((img, idx) => (
                  <div key={idx} className="relative group flex justify-center">
                    <div className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-sm w-full">
                      {img ? (
                        <img
                          src={img}
                          alt={`Who we are ${idx + 1}`}
                          className="w-full h-auto object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/vite.svg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center text-gray-400 bg-primary/30 rounded-t-lg">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{editable.title || "Who We Are"}</h1>
                <div 
                  className="text-base md:text-lg text-white leading-relaxed max-w-4xl mx-auto prose prose-invert prose-p:text-white"
                  dangerouslySetInnerHTML={{ __html: editable.paragraph || "Add your paragraph here..." }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <FieldContent>
                <Input
                  value={editable.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter title"
                  disabled={saving}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <FieldContent>
                <select
                  value={editable.status}
                  onChange={(e) => handleChange("status", e.target.value as "active" | "inactive")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={saving}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>Paragraph</FieldLabel>
            <FieldContent>
              <div className="bg-white">
                <style>{`
                  .quill-editor .ql-container {
                    min-height: 300px;
                    height: 300px;
                  }
                `}</style>
                <div className="quill-editor">
                  <ReactQuill
                    theme="snow"
                    value={editable.paragraph}
                    onChange={(value) => handleChange("paragraph", value)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field>
              <FieldLabel>Image 1</FieldLabel>
              <FieldContent>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("imageFile1", e.target.files?.[0] ?? null)}
                  disabled={saving}
                  className="cursor-pointer"
                />
                {editable.imageFile1 && (
                  <p className="text-xs text-green-600 mt-1">New image selected: {editable.imageFile1.name}</p>
                )}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Image 2</FieldLabel>
              <FieldContent>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("imageFile2", e.target.files?.[0] ?? null)}
                  disabled={saving}
                  className="cursor-pointer"
                />
                {editable.imageFile2 && (
                  <p className="text-xs text-green-600 mt-1">New image selected: {editable.imageFile2.name}</p>
                )}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Image 3</FieldLabel>
              <FieldContent>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("imageFile3", e.target.files?.[0] ?? null)}
                  disabled={saving}
                  className="cursor-pointer"
                />
                {editable.imageFile3 && (
                  <p className="text-xs text-green-600 mt-1">New image selected: {editable.imageFile3.name}</p>
                )}
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

