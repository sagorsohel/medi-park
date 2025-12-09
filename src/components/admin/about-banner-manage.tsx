"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Loader2, RefreshCw } from "lucide-react";
import {
    useGetAboutUsBannerQuery,
    useUpdateAboutUsBannerMutation,
} from "@/services/homepageApi";

export function AboutBannerManage() {
    const { data, isLoading, error, refetch } = useGetAboutUsBannerQuery();
    const [updateAboutUsBanner] = useUpdateAboutUsBannerMutation();

    const [editableData, setEditableData] = useState<{
        background_image?: File | string;
        opacity?: string;
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
        if (editableData.opacity !== undefined && editableData.opacity !== section.opacity) return true;

        return false;
    };

    const handleImageChange = (file: File | null) => {
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        setEditableData(prev => ({
            ...prev,
            background_image: file,
        }));
    };

    const handleOpacityChange = (value: string) => {
        setEditableData(prev => ({
            ...prev,
            opacity: value,
        }));
    };

    const handleUpdate = async () => {
        if (!data?.data || !hasChanges()) return;

        setUpdating(true);

        try {
            await updateAboutUsBanner({
                id: data.data.id,
                data: editableData,
            }).unwrap();

            setEditableData({});
            setImagePreview(null);
            refetch();
        } catch (error) {
            console.error("Failed to update about banner:", error);
            alert("Failed to update about banner. Please try again.");
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
                <p className="text-red-800">Failed to load about banner. Please try again.</p>
                <Button onClick={() => refetch()} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    if (!data?.data) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No about banner data found.</p>
            </div>
        );
    }

    const section = data.data;

    return (
        <div className="mt-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">About Page Banner Management</h2>
                <p className="text-gray-600">Edit the hero banner for the About Us page</p>
            </div>

            <Card>
                <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">About Banner Section</CardTitle>
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
                        <div className="mb-6">
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                <img
                                    src={imagePreview || section.background_image}
                                    alt="About Banner"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/vite.svg";
                                    }}
                                />
                                {/* Overlay preview */}
                                <div
                                    className="absolute inset-0 bg-gray-950"
                                    style={{ opacity: `${parseFloat(editableData.opacity !== undefined ? editableData.opacity : section.opacity) * 100}%` }}
                                />

                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <h1 className="text-4xl font-bold text-white">About Us</h1>
                                </div>
                            </div>
                        </div>

                        <Field>
                            <FieldLabel>Background Image</FieldLabel>
                            <FieldContent>
                                <div className="space-y-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            handleImageChange(file || null);
                                        }}
                                        disabled={updating}
                                        className="cursor-pointer"
                                    />
                                    {editableData.background_image instanceof File && (
                                        <p className="text-xs text-green-600 mt-1">
                                            New image selected: {editableData.background_image.name}
                                        </p>
                                    )}
                                </div>
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Overlay Opacity: {parseFloat(editableData.opacity !== undefined ? editableData.opacity : section.opacity) * 100}%</FieldLabel>
                            <FieldContent>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={parseFloat(editableData.opacity !== undefined ? editableData.opacity : section.opacity) * 100}
                                    onChange={(e) => handleOpacityChange((parseInt(e.target.value) / 100).toString())}
                                    className="w-full"
                                    disabled={updating}
                                />
                            </FieldContent>
                        </Field>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
