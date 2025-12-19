"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2, Plus } from "lucide-react";
import { useGetInvestorByIdQuery, useCreateInvestorMutation, useUpdateInvestorMutation, type Investor } from "@/services/investorApi";
import toast from "react-hot-toast";

export default function AddInvestorPage() {
    const navigate = useNavigate();
    const params = useParams<{ id?: string }>();
    const investorId = params.id ? parseInt(params.id) : null;
    const pathname = window.location.pathname;
    const isViewMode = pathname.includes("/view/");
    const isEditMode = pathname.includes("/edit/");
    const isCreateMode = !investorId && !isEditMode && !isViewMode;

    const { data: investorData, isLoading } = useGetInvestorByIdQuery(investorId!, { skip: !investorId });
    const [createInvestor, { isLoading: isCreating }] = useCreateInvestorMutation();
    const [updateInvestor, { isLoading: isUpdating }] = useUpdateInvestorMutation();

    // Tab state
    const [activeTab, setActiveTab] = useState("personal");

    // Form state - Personal Information
    const [formData, setFormData] = useState({
        file_number: "",
        applicant_full_name: "",
        fathers_name: "",
        mothers_name: "",
        spouses_name: "",
        investor_name: "",
        email_address: "",
        mobile_number: "",
        gender: "",
        date_of_birth: "",
        nationality: "",
        religion: "",
        residency_status: "",
        marital_status: "",
        marriage_date: "",
        organization: "",
        profession: "",
        nid_pp_bc_number: "",
        tin_number: "",
        about: "",
        present_address: "",
        permanent_address: "",
        // Nominee Information
        nominee_name: "",
        nominee_relation: "",
        nominee_mobile_number: "",
        nominee_nid_pp_bc_number: "",
        nominee_present_address: "",
        nominee_permanent_address: "",
        // Project Information
        project_present_address: "",
        project_permanent_address: "",
        // Share Information
        category_of_share: "",
        price_per_hss: "",
        number_of_hss: "",
        total_price: "",
        total_price_in_words: "",
        special_discount: "",
        // Payment Information
        mode_of_payment: "",
        others_instructions: "",
        agreed_price: "",
        installment_start_from: "",
        installment_start_to: "",
        booking_money: "",
        booking_money_in_words: "",
        booking_money_date: "",
        booking_money_cash_cheque_no: "",
        booking_money_branch: "",
        booking_money_on_or_before: "",
        booking_money_mobile_number: "",
        payment_in_words: "",
        final_payment_date: "",
        bank_name: "",
        down_payment: "",
        down_payment_date: "",
        instructions_if_any: "",
        reference_name_a: "",
        reference_name_b: "",
        rest_amount: "",
        rest_amount_in_words: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [applicantImageFile, setApplicantImageFile] = useState<File | null>(null);
    const [applicantImagePreview, setApplicantImagePreview] = useState<string | null>(null);
    const [nomineeImageFile, setNomineeImageFile] = useState<File | null>(null);
    const [nomineeImagePreview, setNomineeImagePreview] = useState<string | null>(null);

    // Load investor data when editing/viewing
    const investor = investorData?.data;
    const hasLoadedData = investor && investorId && formData.investor_name === investor.investor_name;

    useEffect(() => {
        if (investor && investorId && !hasLoadedData) {
            setFormData({
                file_number: investor.file_number || "",
                applicant_full_name: investor.applicant_full_name || "",
                fathers_name: investor.fathers_name || "",
                mothers_name: investor.mothers_name || "",
                spouses_name: investor.spouses_name || "",
                investor_name: investor.investor_name || "",
                email_address: investor.email_address || "",
                mobile_number: investor.mobile_number || "",
                gender: investor.gender || "",
                date_of_birth: investor.date_of_birth || "",
                nationality: investor.nationality || "",
                religion: investor.religion || "",
                residency_status: investor.residency_status || "",
                marital_status: investor.marital_status || "",
                marriage_date: investor.marriage_date || "",
                organization: investor.organization || "",
                profession: investor.profession || "",
                nid_pp_bc_number: investor.nid_pp_bc_number || "",
                tin_number: investor.tin_number || "",
                about: investor.about || "",
                present_address: investor.present_address || "",
                permanent_address: investor.permanent_address || "",
                // Nominee Information
                nominee_name: investor.nominee_name || "",
                nominee_relation: investor.nominee_relation || "",
                nominee_mobile_number: investor.nominee_mobile_number || "",
                nominee_nid_pp_bc_number: investor.nominee_nid_pp_bc_number || "",
                nominee_present_address: investor.nominee_present_address || "",
                nominee_permanent_address: investor.nominee_permanent_address || "",
                // Project Information
                project_present_address: investor.project_present_address || "",
                project_permanent_address: investor.project_permanent_address || "",
                // Share Information
                category_of_share: investor.category_of_share || "",
                price_per_hss: investor.price_per_hss || "",
                number_of_hss: investor.number_of_hss || "",
                total_price: investor.total_price || "",
                total_price_in_words: investor.total_price_in_words || "",
                special_discount: investor.special_discount || "",
                // Payment Information
                mode_of_payment: investor.mode_of_payment || "",
                others_instructions: investor.others_instructions || "",
                agreed_price: investor.agreed_price || "",
                installment_start_from: investor.installment_start_from || "",
                installment_start_to: investor.installment_start_to || "",
                booking_money: investor.booking_money || "",
                booking_money_in_words: investor.booking_money_in_words || "",
                booking_money_date: investor.booking_money_date || "",
                booking_money_cash_cheque_no: investor.booking_money_cash_cheque_no || "",
                booking_money_branch: investor.booking_money_branch || "",
                booking_money_on_or_before: investor.booking_money_on_or_before || "",
                booking_money_mobile_number: investor.booking_money_mobile_number || "",
                payment_in_words: investor.payment_in_words || "",
                final_payment_date: investor.final_payment_date || "",
                bank_name: investor.bank_name || "",
                down_payment: investor.down_payment || "",
                down_payment_date: investor.down_payment_date || "",
                instructions_if_any: investor.instructions_if_any || "",
                reference_name_a: investor.reference_name_a || "",
                reference_name_b: investor.reference_name_b || "",
                rest_amount: investor.rest_amount || "",
                rest_amount_in_words: investor.rest_amount_in_words || "",
            });

            if (investor.image) {
                setImagePreview(investor.image);
            }
            if (investor.applicant_image) {
                setApplicantImagePreview(investor.applicant_image);
            }
            if (investor.nominee_image) {
                setNomineeImagePreview(investor.nominee_image);
            }
        }
    }, [investor, investorId, hasLoadedData]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'applicant_image' | 'nominee_image') => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'image') {
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else if (type === 'applicant_image') {
                setApplicantImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setApplicantImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else if (type === 'nominee_image') {
                setNomineeImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNomineeImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleSubmit = async () => {
        if (isViewMode) return;

        if (!formData.investor_name || !formData.email_address || !formData.mobile_number) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            const payload: any = {
                ...formData,
                image: imageFile || (imagePreview && !imageFile ? imagePreview : undefined),
                applicant_image: applicantImageFile || (applicantImagePreview && !applicantImageFile ? applicantImagePreview : undefined),
                nominee_image: nomineeImageFile || (nomineeImagePreview && !nomineeImageFile ? nomineeImagePreview : undefined),
            };

            if (isEditMode && investorId) {
                await updateInvestor({ id: investorId, data: payload }).unwrap();
                toast.success("Investor updated successfully!");
            } else {
                await createInvestor(payload).unwrap();
                toast.success("Investor created successfully!");
            }
            navigate("/admin/investor");
        } catch (error: any) {
            console.error("Error saving investor:", error);
            toast.error(error?.data?.message || "Failed to save investor. Please try again.");
        }
    };

    if (isLoading && investorId) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            </div>
        );
    }

    const readOnlyProps = isViewMode ? { readOnly: true, className: "bg-primary/30 rounded-t-lg cursor-not-allowed" } : {};

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="h-8 w-8 -ml-2"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Investor</h1>
                </div>
                <p className="text-gray-600 ml-8">Here's what happening in your update</p>
            </div>

            <div className="bg-white rounded-lg p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <TabsList className="bg-transparent gap-4 p-0 h-auto flex-wrap">
                            <TabsTrigger
                                value="personal"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-primary border border-primary rounded-md px-6 py-2.5 font-medium"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Personal Info
                            </TabsTrigger>
                            <TabsTrigger
                                value="nominee"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-primary border border-primary rounded-md px-6 py-2.5 font-medium"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Nominee Info
                            </TabsTrigger>
                            <TabsTrigger
                                value="project"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-primary border border-primary rounded-md px-6 py-2.5 font-medium"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Project Info
                            </TabsTrigger>
                            <TabsTrigger
                                value="share"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-primary border border-primary rounded-md px-6 py-2.5 font-medium"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Share Info
                            </TabsTrigger>
                            <TabsTrigger
                                value="payment"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-primary border border-primary rounded-md px-6 py-2.5 font-medium"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Payment Info
                            </TabsTrigger>
                        </TabsList>
                        {!isViewMode && (
                            <Button
                                className="min-w-[120px]"
                                onClick={handleSubmit}
                                disabled={isCreating || isUpdating}
                            >
                                {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isEditMode ? "Update" : "Save"}
                            </Button>
                        )}
                    </div>

                    {/* Personal Information Tab */}
                    <TabsContent value="personal">
                        <div className="space-y-6">
                            {/* Investor Identity Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="investorId">Investor Identity Number</Label>
                                    <Input
                                        id="investorId"
                                        value={investorData?.data?.investor_identity_number || "Auto Generate"}
                                        readOnly
                                        className="bg-blue-50/50 text-gray-500 border-blue-100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="file_number">File Number</Label>
                                    <Input
                                        id="file_number"
                                        value={formData.file_number}
                                        onChange={(e) => handleInputChange("file_number", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* Applicant Full Name and Fathers Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="applicant_full_name">Applicant Full Name</Label>
                                    <Input
                                        id="applicant_full_name"
                                        value={formData.applicant_full_name}
                                        onChange={(e) => handleInputChange("applicant_full_name", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fathers_name">Father's Name</Label>
                                    <Input
                                        id="fathers_name"
                                        value={formData.fathers_name}
                                        onChange={(e) => handleInputChange("fathers_name", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* Mothers Name and Spouses Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="mothers_name">Mother's Name</Label>
                                    <Input
                                        id="mothers_name"
                                        value={formData.mothers_name}
                                        onChange={(e) => handleInputChange("mothers_name", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="spouses_name">Spouse's Name</Label>
                                    <Input
                                        id="spouses_name"
                                        value={formData.spouses_name}
                                        onChange={(e) => handleInputChange("spouses_name", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* Investor Name and Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="investor_name">Investor Name *</Label>
                                    <Input
                                        id="investor_name"
                                        value={formData.investor_name}
                                        onChange={(e) => handleInputChange("investor_name", e.target.value)}
                                        placeholder="Enter here"
                                        required
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email_address">Email Address *</Label>
                                    <Input
                                        id="email_address"
                                        type="email"
                                        value={formData.email_address}
                                        onChange={(e) => handleInputChange("email_address", e.target.value)}
                                        placeholder="Enter here"
                                        required
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* Mobile Number and Gender */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="mobile_number">Mobile Number *</Label>
                                    <Input
                                        id="mobile_number"
                                        value={formData.mobile_number}
                                        onChange={(e) => handleInputChange("mobile_number", e.target.value)}
                                        placeholder="Enter here"
                                        required
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(value) => handleInputChange("gender", value)}
                                        disabled={isViewMode}
                                    >
                                        <SelectTrigger id="gender" className="w-full" {...readOnlyProps}>
                                            <SelectValue placeholder="Select here" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Date of Birth and Nationality */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationality">Nationality</Label>
                                    <Input
                                        id="nationality"
                                        value={formData.nationality}
                                        onChange={(e) => handleInputChange("nationality", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* Religion and Residency Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="religion">Religion</Label>
                                    <Input
                                        id="religion"
                                        value={formData.religion}
                                        onChange={(e) => handleInputChange("religion", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="residency_status">Residency Status</Label>
                                    <Select
                                        value={formData.residency_status}
                                        onValueChange={(value) => handleInputChange("residency_status", value)}
                                        disabled={isViewMode}
                                    >
                                        <SelectTrigger id="residency_status" className="w-full" {...readOnlyProps}>
                                            <SelectValue placeholder="Select here" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="resident">Resident</SelectItem>
                                            <SelectItem value="non-resident">Non-Resident</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Marital Status and Marriage Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="marital_status">Marital Status</Label>
                                    <Select
                                        value={formData.marital_status}
                                        onValueChange={(value) => handleInputChange("marital_status", value)}
                                        disabled={isViewMode}
                                    >
                                        <SelectTrigger id="marital_status" className="w-full" {...readOnlyProps}>
                                            <SelectValue placeholder="Select here" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single</SelectItem>
                                            <SelectItem value="married">Married</SelectItem>
                                            <SelectItem value="divorced">Divorced</SelectItem>
                                            <SelectItem value="widowed">Widowed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="marriage_date">Marriage Date</Label>
                                    <Input
                                        id="marriage_date"
                                        type="date"
                                        value={formData.marriage_date}
                                        onChange={(e) => handleInputChange("marriage_date", e.target.value)}
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* Organization and Profession */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="organization">Organization</Label>
                                    <Input
                                        id="organization"
                                        value={formData.organization}
                                        onChange={(e) => handleInputChange("organization", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="profession">Profession</Label>
                                    <Input
                                        id="profession"
                                        value={formData.profession}
                                        onChange={(e) => handleInputChange("profession", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* NID/PP/BC Number and TIN Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nid_pp_bc_number">NID/PP/BC Number</Label>
                                    <Input
                                        id="nid_pp_bc_number"
                                        value={formData.nid_pp_bc_number}
                                        onChange={(e) => handleInputChange("nid_pp_bc_number", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tin_number">TIN Number</Label>
                                    <Input
                                        id="tin_number"
                                        value={formData.tin_number}
                                        onChange={(e) => handleInputChange("tin_number", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* Present Address and Permanent Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="present_address">Present Address</Label>
                                    <Textarea
                                        id="present_address"
                                        value={formData.present_address}
                                        onChange={(e) => handleInputChange("present_address", e.target.value)}
                                        rows={3}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="permanent_address">Permanent Address</Label>
                                    <Textarea
                                        id="permanent_address"
                                        value={formData.permanent_address}
                                        onChange={(e) => handleInputChange("permanent_address", e.target.value)}
                                        rows={3}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* About */}
                            <div className="space-y-2">
                                <Label htmlFor="about">About</Label>
                                <Textarea
                                    id="about"
                                    value={formData.about}
                                    onChange={(e) => handleInputChange("about", e.target.value)}
                                    rows={4}
                                    placeholder="Enter here"
                                    {...readOnlyProps}
                                />
                            </div>

                            {/* Images */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Investor Image</Label>
                                    {!isViewMode ? (
                                        <div className="flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                                            <span className="text-muted-foreground">
                                                {imageFile ? imageFile.name : imagePreview ? "Image uploaded" : "No File Chosen"}
                                            </span>
                                            <Input
                                                id="image"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, 'image')}
                                            />
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="h-6 bg-gray-200 hover:bg-gray-300 text-gray-700"
                                                onClick={() => document.getElementById('image')?.click()}
                                            >
                                                Choose File
                                            </Button>
                                        </div>
                                    ) : (
                                        <Input value={investorData?.data?.image || "No image"} readOnly {...readOnlyProps} />
                                    )}
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="applicant_image">Applicant Image</Label>
                                    {!isViewMode ? (
                                        <div className="flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                                            <span className="text-muted-foreground">
                                                {applicantImageFile ? applicantImageFile.name : applicantImagePreview ? "Image uploaded" : "No File Chosen"}
                                            </span>
                                            <Input
                                                id="applicant_image"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, 'applicant_image')}
                                            />
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="h-6 bg-gray-200 hover:bg-gray-300 text-gray-700"
                                                onClick={() => document.getElementById('applicant_image')?.click()}
                                            >
                                                Choose File
                                            </Button>
                                        </div>
                                    ) : (
                                        <Input value={investorData?.data?.applicant_image || "No image"} readOnly {...readOnlyProps} />
                                    )}
                                    {applicantImagePreview && (
                                        <div className="mt-2">
                                            <img src={applicantImagePreview} alt="Applicant Preview" className="w-32 h-32 object-cover rounded-md border" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Nominee Information Tab */}
                    <TabsContent value="nominee">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nominee_name">Nominee Name</Label>
                                    <Input
                                        id="nominee_name"
                                        value={formData.nominee_name}
                                        onChange={(e) => handleInputChange("nominee_name", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nominee_relation">Nominee Relation</Label>
                                    <Input
                                        id="nominee_relation"
                                        value={formData.nominee_relation}
                                        onChange={(e) => handleInputChange("nominee_relation", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nominee_mobile_number">Nominee Mobile Number</Label>
                                    <Input
                                        id="nominee_mobile_number"
                                        value={formData.nominee_mobile_number}
                                        onChange={(e) => handleInputChange("nominee_mobile_number", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nominee_nid_pp_bc_number">Nominee NID/PP/BC Number</Label>
                                    <Input
                                        id="nominee_nid_pp_bc_number"
                                        value={formData.nominee_nid_pp_bc_number}
                                        onChange={(e) => handleInputChange("nominee_nid_pp_bc_number", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nominee_present_address">Nominee Present Address</Label>
                                    <Textarea
                                        id="nominee_present_address"
                                        value={formData.nominee_present_address}
                                        onChange={(e) => handleInputChange("nominee_present_address", e.target.value)}
                                        rows={3}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nominee_permanent_address">Nominee Permanent Address</Label>
                                    <Textarea
                                        id="nominee_permanent_address"
                                        value={formData.nominee_permanent_address}
                                        onChange={(e) => handleInputChange("nominee_permanent_address", e.target.value)}
                                        rows={3}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nominee_image">Nominee Image</Label>
                                {!isViewMode ? (
                                    <div className="flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                                        <span className="text-muted-foreground">
                                            {nomineeImageFile ? nomineeImageFile.name : nomineeImagePreview ? "Image uploaded" : "No File Chosen"}
                                        </span>
                                        <Input
                                            id="nominee_image"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'nominee_image')}
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="h-6 bg-gray-200 hover:bg-gray-300 text-gray-700"
                                            onClick={() => document.getElementById('nominee_image')?.click()}
                                        >
                                            Choose File
                                        </Button>
                                    </div>
                                ) : (
                                    <Input value={investorData?.data?.nominee_image || "No image"} readOnly {...readOnlyProps} />
                                )}
                                {nomineeImagePreview && (
                                    <div className="mt-2">
                                        <img src={nomineeImagePreview} alt="Nominee Preview" className="w-32 h-32 object-cover rounded-md border" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Project Information Tab */}
                    <TabsContent value="project">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="project_present_address">Project Present Address</Label>
                                    <Textarea
                                        id="project_present_address"
                                        value={formData.project_present_address}
                                        onChange={(e) => handleInputChange("project_present_address", e.target.value)}
                                        rows={3}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="project_permanent_address">Project Permanent Address</Label>
                                    <Textarea
                                        id="project_permanent_address"
                                        value={formData.project_permanent_address}
                                        onChange={(e) => handleInputChange("project_permanent_address", e.target.value)}
                                        rows={3}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Share Information Tab */}
                    <TabsContent value="share">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="category_of_share">Category of Share</Label>
                                    <Input
                                        id="category_of_share"
                                        value={formData.category_of_share}
                                        onChange={(e) => handleInputChange("category_of_share", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price_per_hss">Price per HSS</Label>
                                    <Input
                                        id="price_per_hss"
                                        type="number"
                                        value={formData.price_per_hss}
                                        onChange={(e) => handleInputChange("price_per_hss", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="number_of_hss">Number of HSS</Label>
                                    <Input
                                        id="number_of_hss"
                                        type="number"
                                        value={formData.number_of_hss}
                                        onChange={(e) => handleInputChange("number_of_hss", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="total_price">Total Price</Label>
                                    <Input
                                        id="total_price"
                                        type="number"
                                        value={formData.total_price}
                                        onChange={(e) => handleInputChange("total_price", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="total_price_in_words">Total Price in Words</Label>
                                    <Input
                                        id="total_price_in_words"
                                        value={formData.total_price_in_words}
                                        onChange={(e) => handleInputChange("total_price_in_words", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="special_discount">Special Discount</Label>
                                    <Input
                                        id="special_discount"
                                        type="number"
                                        value={formData.special_discount}
                                        onChange={(e) => handleInputChange("special_discount", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Payment Information Tab */}
                    <TabsContent value="payment">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="mode_of_payment">Mode of Payment</Label>
                                    <Select
                                        value={formData.mode_of_payment}
                                        onValueChange={(value) => handleInputChange("mode_of_payment", value)}
                                        disabled={isViewMode}
                                    >
                                        <SelectTrigger id="mode_of_payment" className="w-full" {...readOnlyProps}>
                                            <SelectValue placeholder="Select here" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="cheque">Cheque</SelectItem>
                                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="installment">Installment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="agreed_price">Agreed Price</Label>
                                    <Input
                                        id="agreed_price"
                                        type="number"
                                        value={formData.agreed_price}
                                        onChange={(e) => handleInputChange("agreed_price", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="installment_start_from">Installment Start From</Label>
                                    <Input
                                        id="installment_start_from"
                                        type="date"
                                        value={formData.installment_start_from}
                                        onChange={(e) => handleInputChange("installment_start_from", e.target.value)}
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="installment_start_to">Installment Start To</Label>
                                    <Input
                                        id="installment_start_to"
                                        type="date"
                                        value={formData.installment_start_to}
                                        onChange={(e) => handleInputChange("installment_start_to", e.target.value)}
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="booking_money">Booking Money</Label>
                                    <Input
                                        id="booking_money"
                                        type="number"
                                        value={formData.booking_money}
                                        onChange={(e) => handleInputChange("booking_money", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="booking_money_in_words">Booking Money in Words</Label>
                                    <Input
                                        id="booking_money_in_words"
                                        value={formData.booking_money_in_words}
                                        onChange={(e) => handleInputChange("booking_money_in_words", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="booking_money_date">Booking Money Date</Label>
                                    <Input
                                        id="booking_money_date"
                                        type="date"
                                        value={formData.booking_money_date}
                                        onChange={(e) => handleInputChange("booking_money_date", e.target.value)}
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="booking_money_cash_cheque_no">Booking Money Cash/Cheque No</Label>
                                    <Input
                                        id="booking_money_cash_cheque_no"
                                        value={formData.booking_money_cash_cheque_no}
                                        onChange={(e) => handleInputChange("booking_money_cash_cheque_no", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="booking_money_branch">Booking Money Branch</Label>
                                    <Input
                                        id="booking_money_branch"
                                        value={formData.booking_money_branch}
                                        onChange={(e) => handleInputChange("booking_money_branch", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="booking_money_on_or_before">Booking Money On or Before</Label>
                                    <Input
                                        id="booking_money_on_or_before"
                                        type="date"
                                        value={formData.booking_money_on_or_before}
                                        onChange={(e) => handleInputChange("booking_money_on_or_before", e.target.value)}
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="booking_money_mobile_number">Booking Money Mobile Number</Label>
                                    <Input
                                        id="booking_money_mobile_number"
                                        value={formData.booking_money_mobile_number}
                                        onChange={(e) => handleInputChange("booking_money_mobile_number", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="payment_in_words">Payment in Words</Label>
                                    <Input
                                        id="payment_in_words"
                                        value={formData.payment_in_words}
                                        onChange={(e) => handleInputChange("payment_in_words", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="final_payment_date">Final Payment Date</Label>
                                    <Input
                                        id="final_payment_date"
                                        type="date"
                                        value={formData.final_payment_date}
                                        onChange={(e) => handleInputChange("final_payment_date", e.target.value)}
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bank_name">Bank Name</Label>
                                    <Input
                                        id="bank_name"
                                        value={formData.bank_name}
                                        onChange={(e) => handleInputChange("bank_name", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="down_payment">Down Payment</Label>
                                    <Input
                                        id="down_payment"
                                        type="number"
                                        value={formData.down_payment}
                                        onChange={(e) => handleInputChange("down_payment", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="down_payment_date">Down Payment Date</Label>
                                    <Input
                                        id="down_payment_date"
                                        type="date"
                                        value={formData.down_payment_date}
                                        onChange={(e) => handleInputChange("down_payment_date", e.target.value)}
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="rest_amount">Rest Amount</Label>
                                    <Input
                                        id="rest_amount"
                                        type="number"
                                        value={formData.rest_amount}
                                        onChange={(e) => handleInputChange("rest_amount", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rest_amount_in_words">Rest Amount in Words</Label>
                                    <Input
                                        id="rest_amount_in_words"
                                        value={formData.rest_amount_in_words}
                                        onChange={(e) => handleInputChange("rest_amount_in_words", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="reference_name_a">Reference Name A</Label>
                                    <Input
                                        id="reference_name_a"
                                        value={formData.reference_name_a}
                                        onChange={(e) => handleInputChange("reference_name_a", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reference_name_b">Reference Name B</Label>
                                    <Input
                                        id="reference_name_b"
                                        value={formData.reference_name_b}
                                        onChange={(e) => handleInputChange("reference_name_b", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="others_instructions">Others Instructions</Label>
                                <Textarea
                                    id="others_instructions"
                                    value={formData.others_instructions}
                                    onChange={(e) => handleInputChange("others_instructions", e.target.value)}
                                    rows={3}
                                    placeholder="Enter here"
                                    {...readOnlyProps}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instructions_if_any">Instructions if Any</Label>
                                <Textarea
                                    id="instructions_if_any"
                                    value={formData.instructions_if_any}
                                    onChange={(e) => handleInputChange("instructions_if_any", e.target.value)}
                                    rows={3}
                                    placeholder="Enter here"
                                    {...readOnlyProps}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
