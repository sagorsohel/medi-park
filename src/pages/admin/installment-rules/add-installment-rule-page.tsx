"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useGetInstallmentRuleByIdQuery, useCreateInstallmentRuleMutation, useUpdateInstallmentRuleMutation, type InstallmentRule } from "@/services/installmentRulesApi";
import toast from "react-hot-toast";

export default function AddInstallmentRulePage() {
    const navigate = useNavigate();
    const params = useParams<{ id?: string }>();
    const ruleId = params.id ? parseInt(params.id) : null;
    const pathname = window.location.pathname;
    const isViewMode = pathname.includes("/view/");
    const isEditMode = pathname.includes("/edit/");
    const isCreateMode = !ruleId && !isEditMode && !isViewMode;

    const { data: ruleData, isLoading } = useGetInstallmentRuleByIdQuery(ruleId!, { skip: !ruleId });
    const [createRule, { isLoading: isCreating }] = useCreateInstallmentRuleMutation();
    const [updateRule, { isLoading: isUpdating }] = useUpdateInstallmentRuleMutation();

    // Helper function to convert rule data to form data
    const convertRuleToFormData = useMemo(() => {
        return (rule: InstallmentRule | undefined) => {
            if (!rule) {
                return {
                    name: "",
                    payment_type: "",
                    regular_price: "",
                    special_discount: "0",
                    offer_price: "",
                    down_payment_amount: "",
                    emi_amount: "",
                    duration_months: "",
                    waiver_frequency_months: "",
                    number_of_waivers: "",
                    waiver_amount_per_installment: "",
                    total_waiver_amount: "",
                    is_limited_time_offer: "0",
                    status: "active",
                    description: "",
                };
            }

            // Convert is_limited_time_offer boolean to string "0" or "1"
            let limitedTimeOffer = "0";
            if (typeof rule.is_limited_time_offer === "boolean") {
                limitedTimeOffer = rule.is_limited_time_offer ? "1" : "0";
            } else if (rule.is_limited_time_offer === 1 || rule.is_limited_time_offer === "1") {
                limitedTimeOffer = "1";
            }

            return {
                name: rule.name || "",
                payment_type: rule.payment_type || "",
                regular_price: rule.regular_price || "",
                special_discount: rule.special_discount || "0",
                offer_price: rule.offer_price || "",
                down_payment_amount: rule.down_payment_amount || "",
                emi_amount: rule.emi_amount || "",
                duration_months: rule.duration_months?.toString() || "",
                waiver_frequency_months: rule.waiver_frequency_months?.toString() || "",
                number_of_waivers: rule.number_of_waivers?.toString() || "",
                waiver_amount_per_installment: rule.waiver_amount_per_installment || "",
                total_waiver_amount: rule.total_waiver_amount || "",
                is_limited_time_offer: limitedTimeOffer,
                status: rule.status || "active",
                description: rule.description || "",
            };
        };
    }, []);

    const [formData, setFormData] = useState(() => convertRuleToFormData(ruleData?.data));

    // Update form data when ruleData changes (for edit mode)
    // This effect syncs external API data to component state, which is a valid use case
    // for loading form data from an API response in edit/view modes
    useEffect(() => {
        if (ruleData?.data && ruleId) {
            const newFormData = convertRuleToFormData(ruleData.data);
            // Note: Syncing external API data to form state via useEffect is a standard pattern
            // This is necessary for loading form data when editing existing records
            setFormData(newFormData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ruleData?.data, ruleId]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            
            // Auto-calculate total waiver amount when waiver fields change
            if (field === "waiver_amount_per_installment" || field === "number_of_waivers") {
                const waiverAmount = parseFloat(
                    field === "waiver_amount_per_installment" 
                        ? value 
                        : updated.waiver_amount_per_installment
                ) || 0;
                const numberOfWaivers = parseFloat(
                    field === "number_of_waivers" 
                        ? value 
                        : updated.number_of_waivers
                ) || 0;
                const total = waiverAmount * numberOfWaivers;
                updated.total_waiver_amount = total.toString();
            }
            
            return updated;
        });
    };

    // Calculate total waiver amount using useMemo (derived state)
    const calculatedTotalWaiver = useMemo(() => {
        const waiverAmount = parseFloat(formData.waiver_amount_per_installment) || 0;
        const numberOfWaivers = parseFloat(formData.number_of_waivers) || 0;
        return (waiverAmount * numberOfWaivers).toString();
    }, [formData.waiver_amount_per_installment, formData.number_of_waivers]);

    // Use calculated total waiver amount if waiver fields are filled, otherwise use formData value
    const displayTotalWaiverAmount = 
        formData.waiver_amount_per_installment && formData.number_of_waivers
            ? calculatedTotalWaiver
            : formData.total_waiver_amount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.payment_type || !formData.regular_price || !formData.offer_price) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const payload = {
                ...formData,
                is_limited_time_offer: formData.is_limited_time_offer === "1" ? 1 : 0,
            };

            if (isEditMode && ruleId) {
                await updateRule({ id: ruleId, data: payload }).unwrap();
                toast.success("Installment rule updated successfully!");
            } else {
                await createRule(payload).unwrap();
                toast.success("Installment rule created successfully!");
            }
            navigate("/admin/installment-rules");
        } catch (error: unknown) {
            console.error("Failed to save installment rule:", error);
            const errorMessage = 
                (error && typeof error === "object" && "data" in error && 
                 error.data && typeof error.data === "object" && "message" in error.data &&
                 typeof error.data.message === "string")
                    ? error.data.message
                    : "Failed to save installment rule. Please try again.";
            toast.error(errorMessage);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/admin/installment-rules")}
                    className="mb-4"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Installment Rules
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isCreateMode ? "Create" : isEditMode ? "Edit" : "View"} Installment Rule
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            disabled={isViewMode}
                            required
                        />
                    </div>

                    {/* Payment Type */}
                    <div>
                        <Label htmlFor="payment_type">Payment Type *</Label>
                        <Select
                            value={formData.payment_type || undefined}
                            onValueChange={(value) => handleChange("payment_type", value)}
                            disabled={isViewMode}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="down_payment">Down Payment</SelectItem>
                                <SelectItem value="full_payment">Full Payment</SelectItem>
                                <SelectItem value="installment">Installment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleChange("status", value)}
                            disabled={isViewMode}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Regular Price */}
                    <div>
                        <Label htmlFor="regular_price">Regular Price *</Label>
                        <Input
                            id="regular_price"
                            type="number"
                            value={formData.regular_price}
                            onChange={(e) => handleChange("regular_price", e.target.value)}
                            disabled={isViewMode}
                            required
                        />
                    </div>

                    {/* Special Discount */}
                    <div>
                        <Label htmlFor="special_discount">Special Discount</Label>
                        <Input
                            id="special_discount"
                            type="number"
                            value={formData.special_discount}
                            onChange={(e) => handleChange("special_discount", e.target.value)}
                            disabled={isViewMode}
                        />
                    </div>

                    {/* Offer Price */}
                    <div>
                        <Label htmlFor="offer_price">Offer Price *</Label>
                        <Input
                            id="offer_price"
                            type="number"
                            value={formData.offer_price}
                            onChange={(e) => handleChange("offer_price", e.target.value)}
                            disabled={isViewMode}
                            required
                        />
                    </div>

                    {/* Down Payment Amount */}
                    <div>
                        <Label htmlFor="down_payment_amount">Down Payment Amount</Label>
                        <Input
                            id="down_payment_amount"
                            type="number"
                            value={formData.down_payment_amount}
                            onChange={(e) => handleChange("down_payment_amount", e.target.value)}
                            disabled={isViewMode}
                        />
                    </div>

                    {/* EMI Amount */}
                    <div>
                        <Label htmlFor="emi_amount">EMI Amount</Label>
                        <Input
                            id="emi_amount"
                            type="number"
                            value={formData.emi_amount}
                            onChange={(e) => handleChange("emi_amount", e.target.value)}
                            disabled={isViewMode}
                        />
                    </div>

                    {/* Duration (Months) */}
                    <div>
                        <Label htmlFor="duration_months">Duration (Months)</Label>
                        <Input
                            id="duration_months"
                            type="number"
                            value={formData.duration_months}
                            onChange={(e) => handleChange("duration_months", e.target.value)}
                            disabled={isViewMode}
                        />
                    </div>

                    {/* Waiver Frequency (Months) */}
                    <div>
                        <Label htmlFor="waiver_frequency_months">Waiver Frequency (Months)</Label>
                        <Input
                            id="waiver_frequency_months"
                            type="number"
                            value={formData.waiver_frequency_months}
                            onChange={(e) => handleChange("waiver_frequency_months", e.target.value)}
                            disabled={isViewMode}
                        />
                    </div>

                    {/* Number of Waivers */}
                    <div>
                        <Label htmlFor="number_of_waivers">Number of Waivers</Label>
                        <Input
                            id="number_of_waivers"
                            type="number"
                            value={formData.number_of_waivers}
                            onChange={(e) => handleChange("number_of_waivers", e.target.value)}
                            disabled={isViewMode}
                        />
                    </div>

                    {/* Waiver Amount Per Installment */}
                    <div>
                        <Label htmlFor="waiver_amount_per_installment">Waiver Amount Per Installment</Label>
                        <Input
                            id="waiver_amount_per_installment"
                            type="number"
                            value={formData.waiver_amount_per_installment}
                            onChange={(e) => handleChange("waiver_amount_per_installment", e.target.value)}
                            disabled={isViewMode}
                        />
                    </div>

                    {/* Total Waiver Amount */}
                    <div>
                        <Label htmlFor="total_waiver_amount">Total Waiver Amount</Label>
                        <Input
                            id="total_waiver_amount"
                            type="number"
                            value={displayTotalWaiverAmount}
                            onChange={(e) => handleChange("total_waiver_amount", e.target.value)}
                            disabled={isViewMode}
                            readOnly
                        />
                    </div>

                    {/* Is Limited Time Offer */}
                    <div>
                        <Label htmlFor="is_limited_time_offer">Limited Time Offer</Label>
                        <Select
                            value={formData.is_limited_time_offer || "0"}
                            onValueChange={(value) => handleChange("is_limited_time_offer", value)}
                            disabled={isViewMode}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">No</SelectItem>
                                <SelectItem value="1">Yes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            disabled={isViewMode}
                            rows={4}
                        />
                    </div>
                </div>

                {!isViewMode && (
                    <div className="mt-6 flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/admin/installment-rules")}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating || isUpdating}>
                            {isCreating || isUpdating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {isEditMode ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                isEditMode ? "Update" : "Create"
                            )}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}

