"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Loader2, RefreshCw, Plus, Trash2 } from "lucide-react";
import {
  useGetAboutUsSectionQuery,
  useUpdateAboutUsSectionMutation,
} from "@/services/homepageApi";

interface EditableAboutSection {
  title?: string;
  sub_title?: string;
  content?: string;
  image_1?: string | File;
  image_2?: string | File;
  image_3?: string | File;
  status?: 'active' | 'inactive';
  features?: string[];
}

export function AboutSectionManage() {
  const { data, isLoading, error, refetch } = useGetAboutUsSectionQuery();
  const [updateAboutUsSection] = useUpdateAboutUsSectionMutation();

  const [editableData, setEditableData] = useState<EditableAboutSection>({});
  const [updating, setUpdating] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<{
    image_1?: string;
    image_2?: string;
    image_3?: string;
  }>({});

  // Initialize editable data when data loads
  useEffect(() => {
    if (data?.data) {
      setEditableData({});
      setImagePreviews({});
    }
  }, [data]);

  const [newFeature, setNewFeature] = useState("");

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    const currentFeatures = editableData.features || data?.data?.features || [];
    setEditableData(prev => ({
      ...prev,
      features: [...currentFeatures, newFeature.trim()],
    }));
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    const currentFeatures = editableData.features || data?.data?.features || [];
    setEditableData(prev => ({
      ...prev,
      features: currentFeatures.filter((_, i) => i !== index),
    }));
  };

  const getFeatures = (): string[] => {
    if (editableData.features !== undefined) return editableData.features;
    return data?.data?.features || ['thi', 'ghj']; // Use provided features as fallback/initial
  };

  const hasChanges = (): boolean => {
    if (!data?.data) return false;
    const section = data.data;

    if (editableData.title !== undefined && editableData.title !== section.title) return true;
    if (editableData.sub_title !== undefined && editableData.sub_title !== section.sub_title) return true;
    if (editableData.content !== undefined && editableData.content !== section.content) return true;
    if (editableData.image_1 instanceof File) return true;
    if (editableData.image_2 instanceof File) return true;
    if (editableData.image_3 instanceof File) return true;
    if (editableData.status !== undefined && editableData.status !== section.status) return true;

    if (editableData.features !== undefined) {
      const currentFeatures = section.features || [];
      if (editableData.features.length !== currentFeatures.length) return true;
      for (let i = 0; i < editableData.features.length; i++) {
        if (editableData.features[i] !== currentFeatures[i]) return true;
      }
    }

    return false;
  };

  const getValue = (field: 'title' | 'sub_title' | 'content' | 'image_1' | 'image_2' | 'image_3' | 'status'): string => {
    if (editableData[field] !== undefined) {
      if (field === 'image_1' || field === 'image_2' || field === 'image_3') {
        if (editableData[field] instanceof File) {
          return imagePreviews[field] || '';
        }
        return editableData[field] as string;
      }
      return editableData[field] as string;
    }
    return data?.data?.[field] || '';
  };

  const handleFieldChange = (field: keyof EditableAboutSection, value: string) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (field: 'image_1' | 'image_2' | 'image_3', file: File | null) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreviews(prev => ({
      ...prev,
      [field]: previewUrl,
    }));

    setEditableData(prev => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleUpdate = async () => {
    if (!data?.data || !hasChanges()) return;

    setUpdating(true);

    try {
      await updateAboutUsSection({
        id: data.data.id,
        data: editableData,
      }).unwrap();

      setEditableData({});
      setImagePreviews({});
      refetch();
    } catch (error) {
      console.error("Failed to update about section:", error);
      alert("Failed to update about section. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load about section. Please try again.</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No about section data found.</p>
      </div>
    );
  }

  const section = data.data;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">About Us Section Management</h2>
        <p className="text-gray-600">Edit and manage your home page about us section</p>
      </div>

      <Card>
        <CardHeader className="bg-primary/30 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">About Us Section</CardTitle>
            {hasChanges() && (
              <Button
                variant="default"
                size="sm"
                onClick={handleUpdate}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-1">Update</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <FieldContent>
                <Input
                  value={getValue('title')}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Enter title"
                  disabled={updating}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Sub Title</FieldLabel>
              <FieldContent>
                <Input
                  value={getValue('sub_title')}
                  onChange={(e) => handleFieldChange('sub_title', e.target.value)}
                  placeholder="Enter sub title"
                  disabled={updating}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Content</FieldLabel>
              <FieldContent>
                <textarea
                  value={getValue('content')}
                  onChange={(e) => handleFieldChange('content', e.target.value)}
                  placeholder="Enter content"
                  disabled={updating}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FieldContent>
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Image 1</FieldLabel>
                <FieldContent>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageChange('image_1', file);
                        }
                      }}
                      disabled={updating}
                      className="cursor-pointer"
                    />
                    {(imagePreviews.image_1 || section.image_1) && (
                      <div className="mt-2">
                        <img
                          src={imagePreviews.image_1 || section.image_1}
                          alt="Image 1"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/vite.svg";
                          }}
                        />
                      </div>
                    )}

                    {editableData.image_1 instanceof File && (
                      <p className="text-xs text-green-600 mt-1">
                        New image selected: {editableData.image_1.name}
                      </p>
                    )}
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Image 2</FieldLabel>
                <FieldContent>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageChange('image_2', file);
                        }
                      }}
                      disabled={updating}
                      className="cursor-pointer"
                    />
                    {(imagePreviews.image_2 || section.image_2) && (
                      <div className="mt-2">
                        <img
                          src={imagePreviews.image_2 || section.image_2}
                          alt="Image 2"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/vite.svg";
                          }}
                        />
                      </div>
                    )}

                    {editableData.image_2 instanceof File && (
                      <p className="text-xs text-green-600 mt-1">
                        New image selected: {editableData.image_2.name}
                      </p>
                    )}
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Image 3</FieldLabel>
                <FieldContent>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageChange('image_3', file);
                        }
                      }}
                      disabled={updating}
                      className="cursor-pointer"
                    />
                    {(imagePreviews.image_3 || section.image_3) && (
                      <div className="mt-2">
                        <img
                          src={imagePreviews.image_3 || section.image_3}
                          alt="Image 3"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/vite.svg";
                          }}
                        />
                      </div>
                    )}

                    {editableData.image_3 instanceof File && (
                      <p className="text-xs text-green-600 mt-1">
                        New image selected: {editableData.image_3.name}
                      </p>
                    )}
                  </div>
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <FieldContent>
                <select
                  value={editableData.status !== undefined ? editableData.status : section.status}
                  onChange={(e) => handleFieldChange('status', e.target.value as 'active' | 'inactive')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={updating}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Features</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a new feature"
                      onKeyPress={(e) => e.key === "Enter" && handleAddFeature()}
                      disabled={updating}
                    />
                    <Button
                      type="button"
                      onClick={handleAddFeature}
                      disabled={updating || !newFeature.trim()}
                      variant="outline"
                      size="icon"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {getFeatures().map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg group"
                      >
                        <span className="text-sm text-gray-700">{feature}</span>
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={updating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

