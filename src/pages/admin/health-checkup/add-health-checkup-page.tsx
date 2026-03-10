"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Loader2, Save, X } from "lucide-react";
import {
    useGetHealthCheckupByIdQuery,
    useCreateHealthCheckupMutation,
    useUpdateHealthCheckupMutation,
} from "@/services/healthCheckupApi";
import toast from "react-hot-toast";

export default function AddHealthCheckupPage() {
    const navigate = useNavigate();
    const params = useParams<{ id?: string }>();
    const itemId = params.id ? parseInt(params.id) : null;
    const isEditMode = !!itemId;

    const { data: itemData, isLoading: isFetching } = useGetHealthCheckupByIdQuery(itemId!, { skip: !itemId });
    const [createItem, { isLoading: isCreating }] = useCreateHealthCheckupMutation();
    const [updateItem, { isLoading: isUpdating }] = useUpdateHealthCheckupMutation();

    const [formData, setFormData] = useState({
        title: "",
        phone: "",
        room_no: "",
        status: "active" as "active" | "inactive",
    });

    useEffect(() => {
        if (itemData?.data && isEditMode) {
            const item = itemData.data;
            setFormData({
                title: item.title || "",
                phone: item.phone || "",
                room_no: item.room_no || "",
                status: item.status || "active",
            });
        }
    }, [itemData, isEditMode]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.phone.trim() || !formData.room_no.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            if (isEditMode && itemId) {
                await updateItem({ id: itemId, data: formData }).unwrap();
                toast.success("Health checkup page updated successfully!");
            } else {
                await createItem(formData).unwrap();
                toast.success("Health checkup page created successfully!");
            }
            navigate("/admin/health-checkup");
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
                    onClick={() => navigate("/admin/health-checkup")}
                    className="mb-6 hover:bg-gray-100 rounded-xl px-4 py-2 text-gray-500 font-semibold"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Back to Overview
                </Button>
                <div>
                    <h1 className="text-4xl font-extrabold text-[#111827] tracking-tight">
                        {isEditMode ? "Edit Page Info" : "Create New Page"}
                    </h1>
                    <p className="text-[#6b7280] font-medium mt-2">
                        {isEditMode ? "Update details for the existing health checkup department" : "Configure a new health checkup department page"}
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-4xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        {/* Title */}
                        <div className="md:col-span-2 space-y-3">
                            <Label htmlFor="title" className="text-sm font-bold text-gray-700 ml-1">Department Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                required
                                placeholder="e.g. Executive Health Checkup"
                                className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-3">
                            <Label htmlFor="phone" className="text-sm font-bold text-gray-700 ml-1">Contact Phone *</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                required
                                placeholder="e.g. +880 1234 567 890"
                                className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                            />
                        </div>

                        {/* Room No */}
                        <div className="space-y-3">
                            <Label htmlFor="room_no" className="text-sm font-bold text-gray-700 ml-1">Room Number *</Label>
                            <Input
                                id="room_no"
                                value={formData.room_no}
                                onChange={(e) => handleChange("room_no", e.target.value)}
                                required
                                placeholder="e.g. Room-402, Level-4"
                                className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                            />
                        </div>

                        {/* Status */}
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

                    {/* Submit Actions */}
                    <div className="pt-10 border-t border-gray-50 flex items-center justify-end gap-5">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/admin/health-checkup")}
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
