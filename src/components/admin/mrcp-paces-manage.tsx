"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Loader2, RefreshCw } from "lucide-react";
import {
  useGetMRCPPACESQuery,
  useUpdateMRCPPACESMutation,
  type UpdateMRCPPACESPayload,
} from "@/services/aboutPageApi";

interface EditableState {
  title: string;
  paragraph: string;
  image?: string;
  imageFile?: File;
  status: "active" | "inactive";
}

export function MRCPPACESManage() {
  const { data, isLoading, error, refetch } = useGetMRCPPACESQuery();
  const [updateMRCPPACES] = useUpdateMRCPPACESMutation();
  const [saving, setSaving] = useState(false);
  const [editable, setEditable] = useState<EditableState | null>(null);

  const record = useMemo(() => data?.data, [data]);

  // Initialize editable state when data loads
  useEffect(() => {
    if (record) {
      setEditable({
        title: record.title ?? "",
        paragraph: record.paragraph ?? "",
        image: record.image ?? "",
        status: record.status ?? "inactive",
      });
    }
  }, [record]);

  const handleFileChange = (file: File | null) => {
    if (!editable) return;
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEditable((prev) =>
      prev
        ? {
            ...prev,
            imageFile: file,
            image: url,
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
      const payload: UpdateMRCPPACESPayload = {};
      if (editable.title !== record.title) payload.title = editable.title;
      if (editable.paragraph !== record.paragraph) payload.paragraph = editable.paragraph;
      if (editable.status !== record.status) payload.status = editable.status;
      if (editable.imageFile) payload.image = editable.imageFile;

      await updateMRCPPACES({ id: record.id, data: payload }).unwrap();
      await refetch();
    } catch (err) {
      console.error("Failed to update MRCP PACES section:", err);
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
        <p className="text-red-800">Failed to load MRCP PACES section. Please try again.</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-10 pt-8">
      <div className="p-5">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">MRCP PACES Section</h2>
        <p className="text-gray-600">Manage the MRCP PACES section displayed on the About page.</p>
      </div>

      <Card>
        <CardHeader className="bg-primary/30 rounded-t-lg flex flex-row items-center justify-between">
          <CardTitle>Content</CardTitle>
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Save Changes
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 p-6">
          {/* Preview similar to website section */}
          <div className="w-full bg-white py-10 rounded-xl overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-start">
                {/* Right Side - Large Image */}
                <div className="flex justify-center gap-5">
                  <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 w-full max-w-lg">
                    {editable.image ? (
                      <img
                        src={editable.image}
                        alt={editable.title || "MRCP PACES"}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/vite.svg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center text-gray-400 bg-primary/30 rounded-t-lg">
                        No image
                      </div>
                    )}
                  </div>
                </div>
                {/* Left Side - Title and Text */}
                <div>
                  {/* Subtitle */}
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 md:mb-8 text-left">
                    {editable.title || "MRCP PACES Section"}
                  </h2>

                  {/* Descriptive Paragraph */}
                  <div className="max-w-full">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
                      {editable.paragraph || "Add your paragraph here..."}
                    </p>
                  </div>
                </div>
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
              <textarea
                value={editable.paragraph}
                onChange={(e) => handleChange("paragraph", e.target.value)}
                placeholder="Enter description"
                className="w-full min-h-[120px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Image</FieldLabel>
            <FieldContent>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                disabled={saving}
                className="cursor-pointer"
              />
              {editable.imageFile && (
                <p className="text-xs text-green-600 mt-1">New image selected: {editable.imageFile.name}</p>
              )}
            </FieldContent>
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}

