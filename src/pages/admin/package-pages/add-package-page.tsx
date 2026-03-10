"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Loader2, Save, X } from "lucide-react";
import {
    useGetPackagePageByIdQuery,
    useCreatePackagePageMutation,
    useUpdatePackagePageMutation,
} from "@/services/packagePageApi";
import toast from "react-hot-toast";

export default function AddPackagePagePage() {
    const navigate = useNavigate();
    const params = useParams<{ id?: string }>();
    const itemId = params.id ? parseInt(params.id) : null;
    const isEditMode = !!itemId;

    const { data: itemData, isLoading: isFetching } = useGetPackagePageByIdQuery(itemId!, { skip: !itemId });
    const [createItem, { isLoading: isCreating }] = useCreatePackagePageMutation();
    const [updateItem, { isLoading: isUpdating }] = useUpdatePackagePageMutation();

    const [formData, setFormData] = useState({
        title: "",
        notice: "",
        status: "active" as "active" | "inactive",
    });

    useEffect(() => {
        if (itemData?.data && isEditMode) {
            const item = itemData.data;
            setFormData({
                title: item.title || "",
                notice: item.notice || "",
                status: item.status || "active",
            });
        }
    }, [itemData, isEditMode]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Please provide a title.");
            return;
        }

        try {
            if (isEditMode && itemId) {
                await updateItem({ id: itemId, data: formData }).unwrap();
                toast.success("Package page updated successfully!");
            } else {
                await createItem(formData).unwrap();
                toast.success("Package page created successfully!");
            }
            navigate("/admin/package-pages");
        } catch (error) {
            console.error("Failed to save:", error);
            toast.error("Failed to save. Please try again.");
        }
    };

    if (isFetching) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                    <p className="text-sm font-medium text-gray-400">Loading information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            {/* Navigation & Title */}
            <div className="mb-10">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/admin/package-pages")}
                    className="mb-6 hover:bg-gray-100 rounded-xl px-4 py-2 text-gray-500 font-semibold"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Back to Package Pages
                </Button>
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {isEditMode ? "Edit Package Page Info" : "Create New Package Page"}
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">
                        {isEditMode ? "Update details for the existing package page" : "Configure a new package page details"}
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-4xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        {/* Left Side fields */}
                        <div className="space-y-10">
                            <div className="space-y-3">
                                <Label htmlFor="title" className="text-sm font-bold text-gray-700 ml-1">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    required
                                    placeholder="e.g. Master Health Checkup Page"
                                    className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="status" className="text-sm font-bold text-gray-700 ml-1">Current Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleChange("status", value as "active" | "inactive")}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                                        <SelectItem value="active" className="py-3 rounded-xl focus:bg-primary/5 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <span className="font-semibold text-green-700">Active</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="inactive" className="py-3 rounded-xl focus:bg-red-50/50 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                <span className="font-semibold text-red-700">Inactive</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Right Side fields */}
                        <div className="space-y-3">
                            <Label htmlFor="notice" className="text-sm font-bold text-gray-700 ml-1">Notice</Label>
                            <Textarea
                                id="notice"
                                value={formData.notice}
                                onChange={(e) => handleChange("notice", e.target.value)}
                                placeholder="Important notice for this package page..."
                                className="min-h-[148px] rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-base font-medium resize-y"
                            />
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-10 border-t border-gray-50 flex items-center justify-end gap-5">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/admin/package-pages")}
                            className="px-8 py-6 rounded-2xl font-bold bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            Discard Changes
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="px-8 py-6 rounded-2xl font-bold bg-primary hover:bg-primary/95 text-white shadow-xl shadow-primary/20 transition-all flex items-center gap-2"
                        >
                            {isCreating || isUpdating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>{isEditMode ? "Save Changes" : "Create Page"}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
