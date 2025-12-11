"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { useGetDoctorByIdQuery, useCreateDoctorMutation, useUpdateDoctorMutation } from "@/services/doctorApi";
import toast from "react-hot-toast";

interface EducationEntry {
    id: string;
    instituteName: string;
    qualification: string;
    year: string;
}

interface ExperienceEntry {
    id: string;
    hospitalName: string;
    noOfYears: string;
    year: string;
}

interface SocialMediaEntry {
    id: string;
    title: string;
    link: string;
}

interface MembershipEntry {
    id: string;
    title: string;
    description: string;
    year: string;
}

interface AwardEntry {
    id: string;
    title: string;
    description: string;
    year: string;
}

export default function AddDoctorPage() {
    const navigate = useNavigate();
    const params = useParams<{ id?: string }>();
    const doctorId = params.id ? parseInt(params.id) : null;
    const pathname = window.location.pathname;
    const isViewMode = pathname.includes("/view/");
    const isEditMode = pathname.includes("/edit/");
    const isCreateMode = !doctorId && !isEditMode && !isViewMode;

    const { data: doctorData, isLoading } = useGetDoctorByIdQuery(doctorId!, { skip: !doctorId });
    const [createDoctor, { isLoading: isCreating }] = useCreateDoctorMutation();
    const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

    // Form state
    const [formData, setFormData] = useState({
        doctor_name: "",
        department: "",
        specialist: "",
        email_address: "",
        mobile_number: "",
        gender: "",
        date_of_birth: "",
        known_languages: "",
        registration_number: "",
        about: "",
        present_address: "",
        permanent_address: "",
        display_name: "",
        username: "",
        password: "",
        password_confirmation: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Educational Details
    const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([
        { id: "1", instituteName: "", qualification: "", year: "" },
    ]);

    // Experience
    const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>([
        { id: "1", hospitalName: "", noOfYears: "", year: "" },
    ]);

    // Social Media
    const [socialMediaEntries, setSocialMediaEntries] = useState<SocialMediaEntry[]>([
        { id: "1", title: "", link: "" },
    ]);

    // Membership
    const [membershipEntries, setMembershipEntries] = useState<MembershipEntry[]>([
        { id: "1", title: "", description: "", year: "" },
    ]);

    // Awards
    const [awardEntries, setAwardEntries] = useState<AwardEntry[]>([
        { id: "1", title: "", description: "", year: "" },
    ]);

    // Load doctor data when editing/viewing
    const doctor = doctorData?.data;
    const hasLoadedData = doctor && doctorId && formData.doctor_name === doctor.doctor_name;

    useEffect(() => {
        if (doctor && doctorId && !hasLoadedData) {
            setFormData({
                doctor_name: doctor.doctor_name || "",
                department: doctor.department || "",
                specialist: doctor.specialist || "",
                email_address: doctor.email_address || "",
                mobile_number: doctor.mobile_number || "",
                gender: doctor.gender || "",
                date_of_birth: doctor.date_of_birth || "",
                known_languages: doctor.known_languages || "",
                registration_number: doctor.registration_number || "",
                about: doctor.about || "",
                present_address: doctor.present_address || "",
                permanent_address: doctor.permanent_address || "",
                display_name: "",
                username: "",
                password: "",
                password_confirmation: "",
            });
            if (doctor.image) {
                setImagePreview(doctor.image);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doctor?.id]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const addEducationEntry = () => {
        if (isViewMode) return;
        setEducationEntries([...educationEntries, { id: Date.now().toString(), instituteName: "", qualification: "", year: "" }]);
    };

    const removeEducationEntry = (id: string) => {
        if (isViewMode) return;
        setEducationEntries(educationEntries.filter(entry => entry.id !== id));
    };

    const addExperienceEntry = () => {
        if (isViewMode) return;
        setExperienceEntries([...experienceEntries, { id: Date.now().toString(), hospitalName: "", noOfYears: "", year: "" }]);
    };

    const removeExperienceEntry = (id: string) => {
        if (isViewMode) return;
        setExperienceEntries(experienceEntries.filter(entry => entry.id !== id));
    };

    const addSocialMediaEntry = () => {
        if (isViewMode) return;
        setSocialMediaEntries([...socialMediaEntries, { id: Date.now().toString(), title: "", link: "" }]);
    };

    const removeSocialMediaEntry = (id: string) => {
        if (isViewMode) return;
        setSocialMediaEntries(socialMediaEntries.filter(entry => entry.id !== id));
    };

    const addMembershipEntry = () => {
        if (isViewMode) return;
        setMembershipEntries([...membershipEntries, { id: Date.now().toString(), title: "", description: "", year: "" }]);
    };

    const removeMembershipEntry = (id: string) => {
        if (isViewMode) return;
        setMembershipEntries(membershipEntries.filter(entry => entry.id !== id));
    };

    const addAwardEntry = () => {
        if (isViewMode) return;
        setAwardEntries([...awardEntries, { id: Date.now().toString(), title: "", description: "", year: "" }]);
    };

    const removeAwardEntry = (id: string) => {
        if (isViewMode) return;
        setAwardEntries(awardEntries.filter(entry => entry.id !== id));
    };

    const handleSubmit = async () => {
        if (isViewMode) return;

        if (!formData.doctor_name || !formData.department || !formData.specialist || !formData.email_address || !formData.mobile_number) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            const payload: {
                doctor_name: string;
                department: string;
                specialist: string;
                email_address: string;
                mobile_number: string;
                gender?: string;
                date_of_birth?: string;
                known_languages?: string;
                registration_number?: string;
                about?: string;
                image?: File | string;
                present_address?: string;
                permanent_address?: string;
                display_name?: string;
                username?: string;
                password?: string;
                password_confirmation?: string;
            } = {
                doctor_name: formData.doctor_name,
                department: formData.department,
                specialist: formData.specialist,
                email_address: formData.email_address,
                mobile_number: formData.mobile_number,
            };

            if (formData.gender) payload.gender = formData.gender;
            if (formData.date_of_birth) payload.date_of_birth = formData.date_of_birth;
            if (formData.known_languages) payload.known_languages = formData.known_languages;
            if (formData.registration_number) payload.registration_number = formData.registration_number;
            if (formData.about) payload.about = formData.about;
            if (imageFile) payload.image = imageFile;
            if (formData.present_address) payload.present_address = formData.present_address;
            if (formData.permanent_address) payload.permanent_address = formData.permanent_address;
            if (formData.display_name) payload.display_name = formData.display_name;
            if (formData.username) payload.username = formData.username;
            if (formData.password) payload.password = formData.password;
            if (formData.password_confirmation) payload.password_confirmation = formData.password_confirmation;

            if (isEditMode && doctorId) {
                await updateDoctor({ id: doctorId, data: payload }).unwrap();
                toast.success("Doctor updated successfully!");
            } else {
                await createDoctor(payload).unwrap();
                toast.success("Doctor created successfully!");
            }
            navigate("/admin/doctor");
        } catch (error: unknown) {
            console.error("Failed to save doctor:", error);
            const errorMessage = (error as { data?: { message?: string } })?.data?.message || "Failed to save doctor. Please try again.";
            toast.error(errorMessage);
        }
    };

    if (isLoading && doctorId) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    const readOnlyProps = isViewMode ? { readOnly: true, className: "bg-gray-50 cursor-not-allowed" } : {};

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
                    <h1 className="text-3xl font-bold text-gray-900">Doctor</h1>
                </div>
                <p className="text-gray-600 ml-8">Here's what happening in your update</p>
            </div>

            <div className="bg-white rounded-lg p-6">
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="mb-6 bg-transparent gap-4 p-0 h-auto">
                        <TabsTrigger
                            value="basic"
                            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-primary border border-primary rounded-md px-6 py-2.5 font-medium"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Basic Information
                        </TabsTrigger>
                        <TabsTrigger
                            value="extra"
                            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-primary border border-primary rounded-md px-6 py-2.5 font-medium"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Extra Information
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                        <div className="space-y-6">
                            {/* Doctor Identity Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="doctorId">Doctor Identity Number</Label>
                                    <Input
                                        id="doctorId"
                                        value={doctorData?.data?.doctor_identity_number || "Auto Generate"}
                                        readOnly
                                        className="bg-blue-50/50 text-gray-500 border-blue-100"
                                    />
                                </div>
                            </div>

                            {/* Doctor Name and Department */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="doctorName">Doctor Name *</Label>
                                    <Input
                                        id="doctorName"
                                        value={formData.doctor_name}
                                        onChange={(e) => handleInputChange("doctor_name", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department *</Label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(value) => handleInputChange("department", value)}
                                        disabled={isViewMode}
                                    >
                                        <SelectTrigger id="department" className="w-full" {...readOnlyProps}>
                                            <SelectValue placeholder="Select here" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Anesthesiology">Anesthesiology</SelectItem>
                                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                                            <SelectItem value="Dermatology">Dermatology</SelectItem>
                                            <SelectItem value="ENT Surgery">ENT Surgery</SelectItem>
                                            <SelectItem value="General Medicine">General Medicine</SelectItem>
                                            <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                                            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                            <SelectItem value="Radiology">Radiology</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Specialist and Mobile Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="specialist">Specialist *</Label>
                                    <Select
                                        value={formData.specialist}
                                        onValueChange={(value) => handleInputChange("specialist", value)}
                                        disabled={isViewMode}
                                    >
                                        <SelectTrigger id="specialist" className="w-full" {...readOnlyProps}>
                                            <SelectValue placeholder="Select here" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Surgeon">Surgeon</SelectItem>
                                            <SelectItem value="Physician">Physician</SelectItem>
                                            <SelectItem value="Consultant">Consultant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mobile">Mobile Number *</Label>
                                    <Input
                                        id="mobile"
                                        value={formData.mobile_number}
                                        onChange={(e) => handleInputChange("mobile_number", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* Email Address and Date of Birth */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email_address}
                                        onChange={(e) => handleInputChange("email_address", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                                        placeholder="mm/dd/yyyy"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* Gender and Registration Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <div className="space-y-2">
                                    <Label htmlFor="registration">Registration Number</Label>
                                    <Input
                                        id="registration"
                                        value={formData.registration_number}
                                        onChange={(e) => handleInputChange("registration_number", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                            </div>

                            {/* Known Languages and Image */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="languages">Known Languages</Label>
                                    <Select
                                        value={formData.known_languages}
                                        onValueChange={(value) => handleInputChange("known_languages", value)}
                                        disabled={isViewMode}
                                    >
                                        <SelectTrigger id="languages" className="w-full" {...readOnlyProps}>
                                            <SelectValue placeholder="Select here" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Bengali">Bengali</SelectItem>
                                            <SelectItem value="Hindi">Hindi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image</Label>
                                    {!isViewMode ? (
                                        <div className="flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                                            <span className="text-muted-foreground">
                                                {imageFile ? imageFile.name : "No File Chosen"}
                                            </span>
                                            <Input
                                                id="image"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
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
                                        <Input value={doctorData?.data?.image || "No image"} readOnly {...readOnlyProps} />
                                    )}
                                </div>
                            </div>

                            {/* About and Image Preview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="about">About</Label>
                                    <Input
                                        id="about"
                                        value={formData.about}
                                        onChange={(e) => handleInputChange("about", e.target.value)}
                                        placeholder="Enter here"
                                        {...readOnlyProps}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Image Preview</Label>
                                    <div className="border rounded-md p-4 h-[100px] flex items-center justify-center bg-gray-50">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                                        ) : (
                                            <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                                                <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="presentAddress">Present Address</Label>
                                        <Input
                                            id="presentAddress"
                                            value={formData.present_address}
                                            onChange={(e) => handleInputChange("present_address", e.target.value)}
                                            placeholder="Enter here"
                                            {...readOnlyProps}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="permanentAddress">Permanent Address</Label>
                                        <Input
                                            id="permanentAddress"
                                            value={formData.permanent_address}
                                            onChange={(e) => handleInputChange("permanent_address", e.target.value)}
                                            placeholder="Enter here"
                                            {...readOnlyProps}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Account Details */}
                            {isCreateMode && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Display Name</Label>
                                            <Input
                                                id="displayName"
                                                value={formData.display_name}
                                                onChange={(e) => handleInputChange("display_name", e.target.value)}
                                                placeholder="Enter here"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="username">User Name</Label>
                                            <Input
                                                id="username"
                                                value={formData.username}
                                                onChange={(e) => handleInputChange("username", e.target.value)}
                                                placeholder="Enter here"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => handleInputChange("password", e.target.value)}
                                                placeholder="Enter here"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={formData.password_confirmation}
                                                onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                                                placeholder="Enter here"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="extra">
                        <div className="space-y-8">
                            {/* Educational Details */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Educational Details</h3>
                                {educationEntries.map((entry, index) => (
                                    <div key={entry.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`institute-${entry.id}`}>Institute Name</Label>
                                            <Input
                                                id={`institute-${entry.id}`}
                                                value={entry.instituteName}
                                                onChange={(e) => {
                                                    const updated = [...educationEntries];
                                                    updated[index].instituteName = e.target.value;
                                                    setEducationEntries(updated);
                                                }}
                                                placeholder="Enter here"
                                                {...readOnlyProps}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`qualification-${entry.id}`}>Qualification</Label>
                                            <Input
                                                id={`qualification-${entry.id}`}
                                                value={entry.qualification}
                                                onChange={(e) => {
                                                    const updated = [...educationEntries];
                                                    updated[index].qualification = e.target.value;
                                                    setEducationEntries(updated);
                                                }}
                                                placeholder="Enter here"
                                                {...readOnlyProps}
                                            />
                                        </div>
                                        <div className="space-y-2 relative">
                                            <Label htmlFor={`edu-year-${entry.id}`}>Year</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id={`edu-year-${entry.id}`}
                                                    type="date"
                                                    value={entry.year}
                                                    onChange={(e) => {
                                                        const updated = [...educationEntries];
                                                        updated[index].year = e.target.value;
                                                        setEducationEntries(updated);
                                                    }}
                                                    placeholder="mm/dd/yyyy"
                                                    className="flex-1"
                                                    {...readOnlyProps}
                                                />
                                                {index > 0 && !isViewMode && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => removeEducationEntry(entry.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!isViewMode && (
                                    <Button type="button" onClick={addEducationEntry} className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add more
                                    </Button>
                                )}
                            </div>

                            {/* Experience */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Experience</h3>
                                {experienceEntries.map((entry, index) => (
                                    <div key={entry.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`hospital-${entry.id}`}>Hospital Name</Label>
                                            <Input
                                                id={`hospital-${entry.id}`}
                                                value={entry.hospitalName}
                                                onChange={(e) => {
                                                    const updated = [...experienceEntries];
                                                    updated[index].hospitalName = e.target.value;
                                                    setExperienceEntries(updated);
                                                }}
                                                placeholder="Enter here"
                                                {...readOnlyProps}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`years-${entry.id}`}>No of Years</Label>
                                            <Input
                                                id={`years-${entry.id}`}
                                                value={entry.noOfYears}
                                                onChange={(e) => {
                                                    const updated = [...experienceEntries];
                                                    updated[index].noOfYears = e.target.value;
                                                    setExperienceEntries(updated);
                                                }}
                                                placeholder="Enter here"
                                                {...readOnlyProps}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`exp-year-${entry.id}`}>Year</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id={`exp-year-${entry.id}`}
                                                    type="date"
                                                    value={entry.year}
                                                    onChange={(e) => {
                                                        const updated = [...experienceEntries];
                                                        updated[index].year = e.target.value;
                                                        setExperienceEntries(updated);
                                                    }}
                                                    placeholder="mm/dd/yyyy"
                                                    className="flex-1"
                                                    {...readOnlyProps}
                                                />
                                                {index > 0 && !isViewMode && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => removeExperienceEntry(entry.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!isViewMode && (
                                    <Button type="button" onClick={addExperienceEntry} className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add more
                                    </Button>
                                )}
                            </div>

                            {/* Social Media */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                                {socialMediaEntries.map((entry, index) => (
                                    <div key={entry.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`social-title-${entry.id}`}>Title</Label>
                                            <Select
                                                value={entry.title}
                                                onValueChange={(value) => {
                                                    const updated = [...socialMediaEntries];
                                                    updated[index].title = value;
                                                    setSocialMediaEntries(updated);
                                                }}
                                                disabled={isViewMode}
                                            >
                                                <SelectTrigger id={`social-title-${entry.id}`} className="w-full" {...readOnlyProps}>
                                                    <SelectValue placeholder="Select here" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Facebook">Facebook</SelectItem>
                                                    <SelectItem value="Twitter">Twitter</SelectItem>
                                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                                    <SelectItem value="Instagram">Instagram</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`social-link-${entry.id}`}>Link</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id={`social-link-${entry.id}`}
                                                    value={entry.link}
                                                    onChange={(e) => {
                                                        const updated = [...socialMediaEntries];
                                                        updated[index].link = e.target.value;
                                                        setSocialMediaEntries(updated);
                                                    }}
                                                    placeholder="Enter here"
                                                    className="flex-1"
                                                    {...readOnlyProps}
                                                />
                                                {index > 0 && !isViewMode && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => removeSocialMediaEntry(entry.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!isViewMode && (
                                    <Button type="button" onClick={addSocialMediaEntry} className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add more
                                    </Button>
                                )}
                            </div>

                            {/* Membership */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Membership</h3>
                                {membershipEntries.map((entry, index) => (
                                    <div key={entry.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`membership-title-${entry.id}`}>Title</Label>
                                            <Input
                                                id={`membership-title-${entry.id}`}
                                                value={entry.title}
                                                onChange={(e) => {
                                                    const updated = [...membershipEntries];
                                                    updated[index].title = e.target.value;
                                                    setMembershipEntries(updated);
                                                }}
                                                placeholder="Enter here"
                                                {...readOnlyProps}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`membership-desc-${entry.id}`}>Description</Label>
                                            <Input
                                                id={`membership-desc-${entry.id}`}
                                                value={entry.description}
                                                onChange={(e) => {
                                                    const updated = [...membershipEntries];
                                                    updated[index].description = e.target.value;
                                                    setMembershipEntries(updated);
                                                }}
                                                placeholder="Enter here"
                                                {...readOnlyProps}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`membership-year-${entry.id}`}>Year</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id={`membership-year-${entry.id}`}
                                                    type="date"
                                                    value={entry.year}
                                                    onChange={(e) => {
                                                        const updated = [...membershipEntries];
                                                        updated[index].year = e.target.value;
                                                        setMembershipEntries(updated);
                                                    }}
                                                    placeholder="mm/dd/yyyy"
                                                    className="flex-1"
                                                    {...readOnlyProps}
                                                />
                                                {index > 0 && !isViewMode && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => removeMembershipEntry(entry.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!isViewMode && (
                                    <Button type="button" onClick={addMembershipEntry} className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add more
                                    </Button>
                                )}
                            </div>

                            {/* Awards */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Awards</h3>
                                {awardEntries.map((entry, index) => (
                                    <div key={entry.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`award-title-${entry.id}`}>Title</Label>
                                            <Input
                                                id={`award-title-${entry.id}`}
                                                value={entry.title}
                                                onChange={(e) => {
                                                    const updated = [...awardEntries];
                                                    updated[index].title = e.target.value;
                                                    setAwardEntries(updated);
                                                }}
                                                placeholder="Enter here"
                                                {...readOnlyProps}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`award-desc-${entry.id}`}>Description</Label>
                                            <Input
                                                id={`award-desc-${entry.id}`}
                                                value={entry.description}
                                                onChange={(e) => {
                                                    const updated = [...awardEntries];
                                                    updated[index].description = e.target.value;
                                                    setAwardEntries(updated);
                                                }}
                                                placeholder="Enter here"
                                                {...readOnlyProps}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`award-year-${entry.id}`}>Year</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id={`award-year-${entry.id}`}
                                                    type="date"
                                                    value={entry.year}
                                                    onChange={(e) => {
                                                        const updated = [...awardEntries];
                                                        updated[index].year = e.target.value;
                                                        setAwardEntries(updated);
                                                    }}
                                                    placeholder="mm/dd/yyyy"
                                                    className="flex-1"
                                                    {...readOnlyProps}
                                                />
                                                {index > 0 && !isViewMode && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => removeAwardEntry(entry.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!isViewMode && (
                                    <Button type="button" onClick={addAwardEntry} className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add more
                                    </Button>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Save Button */}
                {!isViewMode && (
                    <div className="mt-8 flex justify-center">
                        <Button
                            className="w-full max-w-md"
                            onClick={handleSubmit}
                            disabled={isCreating || isUpdating}
                        >
                            {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEditMode ? "Update" : "Save"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
