"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Loader2, RefreshCw, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetAboutPageBannerQuery,
  useUpdateAboutPageBannerMutation,
} from "@/services/aboutPageApi";

export function AboutPageBannerManage() {
  const { data, isLoading, error, refetch } = useGetAboutPageBannerQuery();
  const [updateAboutPageBanner] = useUpdateAboutPageBannerMutation();

  const [editableData, setEditableData] = useState<{
    background_image?: File | string;
    opacity?: string;
    status?: "active" | "inactive";
  }>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Initialize editable data when data loads
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
    if (
      editableData.opacity !== undefined &&
      editableData.opacity !== section.opacity
    )
      return true;
    if (
      editableData.status !== undefined &&
      editableData.status !== section.status
    )
      return true;

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
      await updateAboutPageBanner({
        id: data.data.id,
        data: editableData,
      }).unwrap();

      setEditableData({});
      setImagePreview(null);
      refetch();
      toast.success("About page banner updated successfully!");
    } catch (error) {
      console.error("Failed to update about page banner:", error);
      toast.error("Failed to update about page banner. Please try again.");
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
          Failed to load about page banner. Please try again.
        </CardContent>
      </Card>
    );
  }

  const section = data.data;
  const currentImage =
    imagePreview || section.background_image;
  const currentOpacity =
    editableData.opacity !== undefined
      ? editableData.opacity
      : section.opacity;
  const currentStatus =
    editableData.status !== undefined ? editableData.status : section.status;

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>About Page Banner Management</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={updating}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
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
                onChange={(e) =>
                  handleImageChange(e.target.files?.[0] || null)
                }
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

        {/* Action Buttons */}
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

