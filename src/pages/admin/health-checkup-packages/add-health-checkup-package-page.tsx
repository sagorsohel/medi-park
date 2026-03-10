"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Loader2, Save, X, Image as ImageIcon } from "lucide-react";
import {
    useGetHealthCheckupPackageByIdQuery,
    useCreateHealthCheckupPackageMutation,
    useUpdateHealthCheckupPackageMutation,
} from "@/services/healthCheckupPackageApi";
import toast from "react-hot-toast";

export default function AddHealthCheckupPackagePage() {
    const navigate = useNavigate();
    const params = useParams<{ id?: string }>();
    const itemId = params.id ? parseInt(params.id) : null;
    const isEditMode = !!itemId;

    const { data: itemData, isLoading: isFetching } = useGetHealthCheckupPackageByIdQuery(itemId!, { skip: !itemId });
    const [createItem, { isLoading: isCreating }] = useCreateHealthCheckupPackageMutation();
    const [updateItem, { isLoading: isUpdating }] = useUpdateHealthCheckupPackageMutation();

    const [formData, setFormData] = useState({
        package_name: "",
        status: "active" as "active" | "inactive",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (itemData?.data && isEditMode) {
            const item = itemData.data;
            setFormData({
                package_name: item.package_name || "",
                status: item.status || "active",
            });
            setImagePreview(item.image || null);
        }
    }, [itemData, isEditMode]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.package_name.trim()) {
            toast.error("Please provide a package name.");
            return;
        }

        try {
            const payload: any = {
                package_name: formData.package_name,
                status: formData.status,
            };

            if (imageFile) {
                payload.image = imageFile;
            }

            if (isEditMode && itemId) {
                await updateItem({ id: itemId, data: payload }).unwrap();
                toast.success("Health checkup package updated successfully!");
            } else {
                await createItem(payload).unwrap();
                toast.success("Health checkup package created successfully!");
            }
            navigate("/admin/health-checkup-packages");
        } catch (error) {
            console.error("Failed to save:", error);
            toast.error("Failed to save package. Please try again.");
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
                    onClick={() => navigate("/admin/health-checkup-packages")}
                    className="mb-6 hover:bg-gray-100 rounded-xl px-4 py-2 text-gray-500 font-semibold"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Back to Packages
                </Button>
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {isEditMode ? "Edit Package Info" : "Create New Package"}
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">
                        {isEditMode ? "Update details for the existing health checkup package" : "Configure a new health checkup package details"}
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
                                <Label htmlFor="package_name" className="text-sm font-bold text-gray-700 ml-1">Package Name *</Label>
                                <Input
                                    id="package_name"
                                    value={formData.package_name}
                                    onChange={(e) => handleChange("package_name", e.target.value)}
                                    required
                                    placeholder="e.g. Comprehensive Heart Checkup"
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
                            <Label className="text-sm font-bold text-gray-700 ml-1">Package Image</Label>
                            <div className="relative group">
                                <div
                                    className={`w-full aspect-square md:aspect-auto md:h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${imagePreview ? "border-primary/20 bg-primary/5" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                        }`}
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-semibold flex items-center gap-2">
                                                    <ImageIcon className="w-5 h-5" /> Change Image
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 text-gray-400 p-6 text-center">
                                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-300 border border-gray-100">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-600">Click to upload image</p>
                                                <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-10 border-t border-gray-50 flex items-center justify-end gap-5">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/admin/health-checkup-packages")}
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
                                    <span>{isEditMode ? "Save Changes" : "Create Package"}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
