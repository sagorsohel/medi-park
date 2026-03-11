"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Loader2, RefreshCw, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
    useGetCareerPagesQuery,
    useCreateCareerPageMutation,
    useUpdateCareerPageMutation,
} from "@/services/careerPageApi";

export function CareerPageManage() {
    const { data, isLoading, error, refetch } = useGetCareerPagesQuery();
    const [createCareerPage] = useCreateCareerPageMutation();
    const [updateCareerPage] = useUpdateCareerPageMutation();

    const [editableData, setEditableData] = useState<{
        title?: string;
        section1?: string;
        card_image?: File | string;
        card_title?: string;
        card_subtitle?: string;
        card_description?: string;
        message_title?: string;
        message_description?: string;
        after_message_section?: string;
        job_section_title?: string;
        join_us_section_title?: string;
        join_us_section_subtitle?: string;
        join_us_section_button?: string;
        employee_engagement_title?: string;
        employee_engagement_button?: string;
        status?: "active" | "inactive";
    }>({});

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (data?.data && data.data.length > 0) {
            setEditableData({});
            setImagePreview(null);
        }
    }, [data]);

    const hasChanges = (): boolean => {
        // If no existing data, but we have some input, consider it modified
        if (!data?.data || data.data.length === 0) {
            return Object.keys(editableData).length > 0;
        }

        const current = data.data[0];

        // Check text/boolean fields
        for (const key of Object.keys(editableData)) {
            if (key === "card_image" && editableData.card_image instanceof File) {
                return true;
            }
            if (
                key !== "card_image" &&
                editableData[key as keyof typeof editableData] !==
                current[key as keyof typeof current]
            ) {
                return true;
            }
        }

        return false;
    };

    const handleInputChange = (field: string, value: string) => {
        setEditableData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageChange = (file: File | null) => {
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setEditableData((prev) => ({
            ...prev,
            card_image: file,
        }));
    };

    const handleSave = async () => {
        if (!hasChanges()) return;

        setSaving(true);

        try {
            if (data?.data && data.data.length > 0) {
                // Update existing
                await updateCareerPage({
                    id: data.data[0].id,
                    data: editableData,
                }).unwrap();
                toast.success("Career page updated successfully!");
            } else {
                // Create new
                await createCareerPage(editableData).unwrap();
                toast.success("Career page created successfully!");
            }

            setEditableData({});
            setImagePreview(null);
            refetch();
        } catch (err) {
            console.error("Failed to save career page:", err);
            toast.error("Failed to save career page. Please try again.");
        } finally {
            setSaving(false);
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

    if (error) {
        return (
            <Card className="mt-8">
                <CardContent className="text-center py-12 text-red-500">
                    Failed to load career page data. Please try again.
                </CardContent>
            </Card>
        );
    }

    const currentData = data?.data && data.data.length > 0 ? data.data[0] : null;

    const getValue = (key: keyof typeof editableData) => {
        if (editableData[key] !== undefined) return editableData[key] as string;
        if (currentData) return currentData[key as keyof typeof currentData] as string;
        return "";
    };

    const currentImage = imagePreview || (currentData?.card_image as string) || null;

    return (
        <Card className="mt-8 p-5">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Career Page Setting</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            disabled={saving}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                        <FieldLabel>Page Title</FieldLabel>
                        <FieldContent>
                            <Input
                                value={getValue("title")}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Ex. Careeers"
                            />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Section 1 (Banner text)</FieldLabel>
                        <FieldContent>
                            <Input
                                value={getValue("section1")}
                                onChange={(e) => handleInputChange("section1", e.target.value)}
                                placeholder="Ex. Find open jobs at Medipark"
                            />
                        </FieldContent>
                    </Field>
                </div>

                <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4 text-lg">Card Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field>
                            <FieldLabel>Card Image</FieldLabel>
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
                                        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300">
                                            <img
                                                src={currentImage}
                                                alt="Card Preview"
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

                        <Field className="space-y-4">
                            <FieldLabel>Card Subtitle</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={getValue("card_subtitle")}
                                    onChange={(e) => handleInputChange("card_subtitle", e.target.value)}
                                    placeholder="Ex. Current Openings"
                                />
                            </FieldContent>

                            <FieldLabel className="mt-4 block">Card Title</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={getValue("card_title")}
                                    onChange={(e) => handleInputChange("card_title", e.target.value)}
                                    placeholder="Ex. We're hiring for..."
                                />
                            </FieldContent>
                        </Field>

                        <Field className="md:col-span-2">
                            <FieldLabel>Card Description</FieldLabel>
                            <FieldContent>
                                <Textarea
                                    value={getValue("card_description")}
                                    onChange={(e) => handleInputChange("card_description", e.target.value)}
                                    placeholder="Description about the card..."
                                    rows={3}
                                />
                            </FieldContent>
                        </Field>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4 text-lg">Message Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field className="md:col-span-2">
                            <FieldLabel>Title</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={getValue("message_title")}
                                    onChange={(e) => handleInputChange("message_title", e.target.value)}
                                    placeholder="Ex. Message from head"
                                />
                            </FieldContent>
                        </Field>

                        <Field className="md:col-span-2">
                            <FieldLabel>Description</FieldLabel>
                            <FieldContent>
                                <Textarea
                                    value={getValue("message_description")}
                                    onChange={(e) => handleInputChange("message_description", e.target.value)}
                                    placeholder="Message content..."
                                    rows={4}
                                />
                            </FieldContent>
                        </Field>
                        <Field className="md:col-span-2">
                            <FieldLabel>After Message Section</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={getValue("after_message_section")}
                                    onChange={(e) => handleInputChange("after_message_section", e.target.value)}
                                    placeholder="Additional text below message"
                                />
                            </FieldContent>
                        </Field>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4 text-lg">Job & Join Us Sections</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field>
                            <FieldLabel>Job Section Title</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={getValue("job_section_title")}
                                    onChange={(e) => handleInputChange("job_section_title", e.target.value)}
                                    placeholder="Ex. Available Positions"
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Join Us Section Title</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={getValue("join_us_section_title")}
                                    onChange={(e) => handleInputChange("join_us_section_title", e.target.value)}
                                    placeholder="Ex. Why Join Us?"
                                />
                            </FieldContent>
                        </Field>

                        <Field className="md:col-span-2">
                            <FieldLabel>Join Us Section Subtitle</FieldLabel>
                            <FieldContent>
                                <Textarea
                                    value={getValue("join_us_section_subtitle")}
                                    onChange={(e) => handleInputChange("join_us_section_subtitle", e.target.value)}
                                    placeholder="Short brief for Join Us section"
                                    rows={2}
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Join Us Section Button</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={getValue("join_us_section_button")}
                                    onChange={(e) => handleInputChange("join_us_section_button", e.target.value)}
                                    placeholder="Ex. Apply Now"
                                />
                            </FieldContent>
                        </Field>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4 text-lg">Employee Engagement Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field>
                            <FieldLabel>Title</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={getValue("employee_engagement_title")}
                                    onChange={(e) => handleInputChange("employee_engagement_title", e.target.value)}
                                    placeholder="Ex. Life at Medipark"
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Button Text</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={getValue("employee_engagement_button")}
                                    onChange={(e) => handleInputChange("employee_engagement_button", e.target.value)}
                                    placeholder="Ex. See More"
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <FieldContent>
                                <select
                                    value={getValue("status") || "active"}
                                    onChange={(e) =>
                                        handleInputChange("status", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                                >
                                    <option value="inactive">Inactive</option>
                                    <option value="active">Active</option>
                                </select>
                            </FieldContent>
                        </Field>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t">
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges() || saving}
                        className="flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                {currentData ? "Update Data" : "Save Data"}
                            </>
                        )}
                    </Button>

                    {hasChanges() && (
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            disabled={saving}
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
