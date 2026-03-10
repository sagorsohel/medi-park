"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Loader2, Save, X, PlusCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    useGetHomepagePricingByIdQuery,
    useCreateHomepagePricingMutation,
    useUpdateHomepagePricingMutation,
} from "@/services/homepagePricingApi";
import toast from "react-hot-toast";

export default function AddHomepagePricingPage() {
    const navigate = useNavigate();
    const params = useParams<{ id?: string }>();
    const itemId = params.id ? parseInt(params.id) : null;
    const isEditMode = !!itemId;

    const { data: itemData, isLoading: isFetching } = useGetHomepagePricingByIdQuery(itemId!, { skip: !itemId });
    const [createItem, { isLoading: isCreating }] = useCreateHomepagePricingMutation();
    const [updateItem, { isLoading: isUpdating }] = useUpdateHomepagePricingMutation();

    const [formData, setFormData] = useState({
        title: "",
        price: "" as string | number,
        duration: "month",
        description: "",
        highlight: false,
        status: "active" as "active" | "inactive",
    });

    // Handle string array separately for easier manipulation
    const [featuresList, setFeaturesList] = useState<string[]>([]);

    // Controlled value for new feature insertion
    const [newFeatureText, setNewFeatureText] = useState("");

    useEffect(() => {
        if (itemData?.data && isEditMode) {
            const item = itemData.data;
            setFormData({
                title: item.title || "",
                price: item.price !== null ? item.price : "",
                duration: item.duration || "month",
                description: item.description || "",
                highlight: Boolean(item.highlight),
                status: item.status || "active",
            });

            // Map saved JSON string or array
            if (item.features) {
                // Determine if already array or string format
                const fData = typeof item.features === "string" ? JSON.parse(item.features) : item.features;
                if (Array.isArray(fData)) {
                    setFeaturesList(fData);
                }
            }
        }
    }, [itemData, isEditMode]);

    const handleChange = (field: string, value: string | boolean | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addFeature = () => {
        if (!newFeatureText.trim()) return;
        setFeaturesList([...featuresList, newFeatureText.trim()]);
        setNewFeatureText(""); // reset
    };

    const handleFeatureKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addFeature();
        }
    }

    const removeFeature = (idx: number) => {
        setFeaturesList(featuresList.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Please provide a title.");
            return;
        }

        const payload = {
            ...formData,
            features: featuresList, // Array format will be parsed correctly in backend natively
            highlight: formData.highlight ? 1 : 0
        };

        try {
            if (isEditMode && itemId) {
                await updateItem({ id: itemId, data: payload }).unwrap();
                toast.success("Homepage pricing updated successfully!");
            } else {
                await createItem(payload).unwrap();
                toast.success("Homepage pricing created successfully!");
            }
            navigate("/admin/homepage-pricings");
        } catch (error: any) {
            console.error("Failed to save:", error);
            if (error?.data?.message) {
                toast.error(error.data.message);
            } else {
                toast.error("Failed to save. Please try again.");
            }
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
                    onClick={() => navigate("/admin/homepage-pricings")}
                    className="mb-6 hover:bg-gray-100 rounded-xl px-4 py-2 text-gray-500 font-semibold"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Back to Pricings
                </Button>
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {isEditMode ? "Edit Homepage Pricing" : "Create New Pricing"}
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">
                        {isEditMode ? "Update details for the existing pricing plan" : "Configure a new pricing structure visually"}
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-4xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        {/* Upper fields */}
                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
                            <div className="space-y-3">
                                <Label htmlFor="title" className="text-sm font-bold text-gray-700 ml-1">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    required
                                    placeholder="e.g. Starter Plan"
                                    className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label htmlFor="price" className="text-sm font-bold text-gray-700 ml-1">Price *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                        required
                                        placeholder="e.g. 50"
                                        className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="duration" className="text-sm font-bold text-gray-700 ml-1">Duration Cycle *</Label>
                                    <Select
                                        value={formData.duration}
                                        onValueChange={(value) => handleChange("duration", value)}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                                            <SelectItem value="month" className="py-3 rounded-xl focus:bg-primary/5 cursor-pointer">
                                                <span className="font-semibold text-gray-700">Month / month</span>
                                            </SelectItem>
                                            <SelectItem value="year" className="py-3 rounded-xl focus:bg-primary/5 cursor-pointer">
                                                <span className="font-semibold text-gray-700">Year / year</span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Mid fields */}
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label htmlFor="description" className="text-sm font-bold text-gray-700 ml-1">Short Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    placeholder="Brief plan summary..."
                                    className="min-h-[148px] rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-base font-medium resize-y"
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

                            <div className="grid gap-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                <div className="grid gap-1.5">
                                    <Label className="text-sm font-bold text-gray-700">Highlight this plan</Label>
                                    <p className="text-xs text-gray-500">
                                        Visually emphasizes this pricing tier on the frontend
                                    </p>
                                </div>
                                <RadioGroup
                                    value={formData.highlight ? "true" : "false"}
                                    onValueChange={(v) => handleChange("highlight", v === "true")}
                                    className="flex items-center gap-6"
                                >
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        <RadioGroupItem value="true" id="highlight-yes" />
                                        <Label htmlFor="highlight-yes" className="font-semibold cursor-pointer text-gray-700">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        <RadioGroupItem value="false" id="highlight-no" />
                                        <Label htmlFor="highlight-no" className="font-semibold cursor-pointer text-gray-700">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {/* Features List Section */}
                        <div className="space-y-6">
                            <Label className="text-sm font-bold text-gray-700 ml-1">Add Features</Label>

                            <div className="space-y-3 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 h-full">
                                <div className="flex gap-2 relative">
                                    <Input
                                        placeholder="Type feature name..."
                                        value={newFeatureText}
                                        onChange={(e) => setNewFeatureText(e.target.value)}
                                        onKeyDown={handleFeatureKeyDown}
                                        className="h-12 rounded-xl focus:bg-white transition-all font-medium pr-12"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={addFeature}
                                        className="absolute right-1 top-1 h-10 w-10 shrink-0 text-primary hover:bg-primary/10 rounded-lg bg-transparent hover:text-primary transition-colors"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Dynamic Features Render array layout */}
                                {featuresList.length > 0 ? (
                                    <div className="space-y-2 mt-4 max-h-[260px] overflow-y-auto pr-2">
                                        {featuresList.map((str, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-3 px-4 rounded-xl border shadow-sm group hover:border-blue-200 transition-colors">
                                                <span className="text-sm font-bold text-gray-700 break-all">{str}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFeature(idx)}
                                                    className="w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 font-medium py-10 text-center tracking-tight border-2 border-dashed border-gray-200 rounded-xl mt-4">No features added yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-10 border-t border-gray-50 flex items-center justify-end gap-5">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/admin/homepage-pricings")}
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
                                    <span>{isEditMode ? "Save Changes" : "Create Pricing"}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
