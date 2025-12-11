"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Check, Loader2, RefreshCw, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetBlogPageBannerQuery,
  useUpdateBlogPageBannerMutation,
} from "@/services/blogPageApi";

export function BlogPageBannerManage() {
  const { data, isLoading, error, refetch } = useGetBlogPageBannerQuery();
  const [updateBlogPageBanner] = useUpdateBlogPageBannerMutation();

  const [editableData, setEditableData] = useState<{
    background_image?: File | string;
    opacity?: string;
    status?: "active" | "inactive";
  }>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setEditableData({});
      setImagePreview(null);
    }
  }, [data]);

  const hasChanges = (): boolean => {
    if (!data?.data) return false;
    const section = data.data;
    if (editableData.background_image instanceof File) return true;
    if (editableData.opacity !== undefined && editableData.opacity !== section.opacity) return true;
    if (editableData.status !== undefined && editableData.status !== section.status) return true;
    return false;
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setEditableData((prev) => ({
      ...prev,
      background_image: file,
    }));
  };

  const handleOpacityChange = (value: string) => {
    setEditableData((prev) => ({
      ...prev,
      opacity: value,
    }));
  };

  const handleStatusChange = (value: "active" | "inactive") => {
    setEditableData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleUpdate = async () => {
    if (!data?.data || !hasChanges()) return;
    setUpdating(true);
    try {
      await updateBlogPageBanner({
        id: data.data.id,
        data: editableData,
      }).unwrap();
      setEditableData({});
      setImagePreview(null);
      refetch();
      toast.success("Blog page banner updated successfully!");
    } catch (err) {
      console.error("Failed to update blog page banner:", err);
      toast.error("Failed to update blog page banner. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReset = () => {
    setEditableData({});
    setImagePreview(null);
  };

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.data) {
    return (
      <Card className="mt-8">
        <CardContent className="text-center py-12 text-red-500">
          Failed to load blog page banner. Please try again.
        </CardContent>
      </Card>
    );
  }

  const section = data.data;
  const currentImage = imagePreview || section.background_image;
  const currentOpacity =
    editableData.opacity !== undefined ? editableData.opacity : section.opacity;
  const currentStatus =
    editableData.status !== undefined ? editableData.status : section.status;

  return (
    <Card className="mt-8 p-5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Blog Page Banner Management</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={updating}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Field>
          <FieldLabel>Background Image</FieldLabel>
          <FieldContent>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              />
              {currentImage && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300">
                  <img
                    src={currentImage}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vite.svg";
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-gray-950"
                    style={{ opacity: parseFloat(currentOpacity) }}
                  />
                </div>
              )}
            </div>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Overlay Opacity ({currentOpacity})</FieldLabel>
          <FieldContent>
            <div className="space-y-2">
              <Input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={currentOpacity}
                onChange={(e) => handleOpacityChange(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0 (Transparent)</span>
                <span>1 (Opaque)</span>
              </div>
            </div>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Status</FieldLabel>
          <FieldContent>
            <select
              value={currentStatus}
              onChange={(e) =>
                handleStatusChange(e.target.value as "active" | "inactive")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </FieldContent>
        </Field>

        <div className="flex items-center gap-4 pt-4 border-t">
          <Button
            onClick={handleUpdate}
            disabled={!hasChanges() || updating}
            className="flex items-center gap-2"
          >
            {updating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Update Banner
              </>
            )}
          </Button>

          {hasChanges() && (
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={updating}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset Changes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

