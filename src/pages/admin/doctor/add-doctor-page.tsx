"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Plus, Trash2, Calendar } from "lucide-react";

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

    const addEducationEntry = () => {
        setEducationEntries([...educationEntries, { id: Date.now().toString(), instituteName: "", qualification: "", year: "" }]);
    };

    const removeEducationEntry = (id: string) => {
        setEducationEntries(educationEntries.filter(entry => entry.id !== id));
    };

    const addExperienceEntry = () => {
        setExperienceEntries([...experienceEntries, { id: Date.now().toString(), hospitalName: "", noOfYears: "", year: "" }]);
    };

    const removeExperienceEntry = (id: string) => {
        setExperienceEntries(experienceEntries.filter(entry => entry.id !== id));
    };

    const addSocialMediaEntry = () => {
        setSocialMediaEntries([...socialMediaEntries, { id: Date.now().toString(), title: "", link: "" }]);
    };

    const removeSocialMediaEntry = (id: string) => {
        setSocialMediaEntries(socialMediaEntries.filter(entry => entry.id !== id));
    };

    const addMembershipEntry = () => {
        setMembershipEntries([...membershipEntries, { id: Date.now().toString(), title: "", description: "", year: "" }]);
    };

    const removeMembershipEntry = (id: string) => {
        setMembershipEntries(membershipEntries.filter(entry => entry.id !== id));
    };

    const addAwardEntry = () => {
        setAwardEntries([...awardEntries, { id: Date.now().toString(), title: "", description: "", year: "" }]);
    };

    const removeAwardEntry = (id: string) => {
        setAwardEntries(awardEntries.filter(entry => entry.id !== id));
    };

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
                                    <Input id="doctorId" value="Auto Generate" readOnly className="bg-blue-50/50 text-gray-500 border-blue-100" />
                                </div>
                            </div>

                            {/* Doctor Name and Department */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="doctorName">Doctor Name</Label>
                                    <Input id="doctorName" placeholder="Enter here" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select>
                                        <SelectTrigger id="department" className="w-full">
                                            <SelectValue placeholder="Select here" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="anesthesiology">Anesthesiology</SelectItem>
                                            <SelectItem value="cardiology">Cardiology</SelectItem>
                                            <SelectItem value="dermatology">Dermatology</SelectItem>
                                            <SelectItem value="ent">ENT Surgery</SelectItem>
                                            <SelectItem value="general">General Medicine</SelectItem>
                                            <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
                                            <SelectItem value="orthopedics">Orthopedics</SelectItem>
                                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                                            <SelectItem value="radiology">Radiology</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Specialist and Mobile Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="specialist">Specialist</Label>
                                    <Select>
                                        <SelectTrigger id="specialist" className="w-full">
                                            <SelectValue placeholder="Select here" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="surgeon">Surgeon</SelectItem>
                                            <SelectItem value="physician">Physician</SelectItem>
                                            <SelectItem value="consultant">Consultant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mobile">Mobile Number</Label>
                                    <Input id="mobile" placeholder="Enter here" />
                                </div>
                            </div>

                            {/* Email Address and Date of Birth */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="Enter here" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" type="date" placeholder="mm/dd/yyyy" />
                                </div>
                            </div>

                            {/* Gender and Registration Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select>
                                        <SelectTrigger id="gender" className="w-full">
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
                                    <Input id="registration" placeholder="Enter here" />
                                </div>
                            </div>

                            {/* Known Languages and Image */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="languages">Known Languages</Label>
                                    <Select>
                                        <SelectTrigger id="languages" className="w-full">
                                            <SelectValue placeholder="Select here" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="bengali">Bengali</SelectItem>
                                            <SelectItem value="hindi">Hindi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image</Label>
                                    <div className="flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                                        <span className="text-muted-foreground">Choose File No File Chosen</span>
                                        <Input id="image" type="file" className="hidden" accept="image/*" />
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
                                </div>
                            </div>

                            {/* About and Image Preview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="about">About</Label>
                                    <Input id="about" placeholder="Enter here" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Image Preview</Label>
                                    <div className="border rounded-md p-4 h-[100px] flex items-center justify-center bg-gray-50">
                                        <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                                            <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="presentAddress">Present Address</Label>
                                        <Input id="presentAddress" placeholder="Enter here" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="permanentAddress">Permanent Address</Label>
                                        <Input id="permanentAddress" placeholder="Enter here" />
                                    </div>
                                </div>
                            </div>

                            {/* Account Details */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="displayName">Display Name</Label>
                                        <Input id="displayName" placeholder="Enter here" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">User Name</Label>
                                        <Input id="username" placeholder="Enter here" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" placeholder="Enter here" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input id="confirmPassword" type="password" placeholder="Enter here" />
                                    </div>
                                </div>
                            </div>
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
                                            <Input id={`institute-${entry.id}`} placeholder="Enter here" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`qualification-${entry.id}`}>Qualification</Label>
                                            <Input id={`qualification-${entry.id}`} placeholder="Enter here" />
                                        </div>
                                        <div className="space-y-2 relative">
                                            <Label htmlFor={`edu-year-${entry.id}`}>Year</Label>
                                            <div className="flex gap-2">
                                                <Input id={`edu-year-${entry.id}`} type="date" placeholder="mm/dd/yyyy" className="flex-1" />
                                                {index > 0 && (
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
                                <Button type="button" onClick={addEducationEntry} className="mt-2">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add more
                                </Button>
                            </div>

                            {/* Experience */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Experience</h3>
                                {experienceEntries.map((entry, index) => (
                                    <div key={entry.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`hospital-${entry.id}`}>Hospital Name</Label>
                                            <Input id={`hospital-${entry.id}`} placeholder="Enter here" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`years-${entry.id}`}>No of Years</Label>
                                            <Input id={`years-${entry.id}`} placeholder="Enter here" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`exp-year-${entry.id}`}>Year</Label>
                                            <div className="flex gap-2">
                                                <Input id={`exp-year-${entry.id}`} type="date" placeholder="mm/dd/yyyy" className="flex-1" />
                                                {index > 0 && (
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
                                <Button type="button" onClick={addExperienceEntry} className="mt-2">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add more
                                </Button>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                                {socialMediaEntries.map((entry, index) => (
                                    <div key={entry.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`social-title-${entry.id}`}>Title</Label>
                                            <Select>
                                                <SelectTrigger id={`social-title-${entry.id}`} className="w-full">
                                                    <SelectValue placeholder="Select here" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="facebook">Facebook</SelectItem>
                                                    <SelectItem value="twitter">Twitter</SelectItem>
                                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                                    <SelectItem value="instagram">Instagram</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`social-link-${entry.id}`}>Link</Label>
                                            <div className="flex gap-2">
                                                <Input id={`social-link-${entry.id}`} placeholder="Enter here" className="flex-1" />
                                                {index > 0 && (
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
                                <Button type="button" onClick={addSocialMediaEntry} className="mt-2">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add more
                                </Button>
                            </div>

                            {/* Membership */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Membership</h3>
                                {membershipEntries.map((entry, index) => (
                                    <div key={entry.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`membership-title-${entry.id}`}>Title</Label>
                                            <Input id={`membership-title-${entry.id}`} placeholder="Enter here" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`membership-desc-${entry.id}`}>Description</Label>
                                            <Input id={`membership-desc-${entry.id}`} placeholder="Enter here" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`membership-year-${entry.id}`}>Year</Label>
                                            <div className="flex gap-2">
                                                <Input id={`membership-year-${entry.id}`} type="date" placeholder="mm/dd/yyyy" className="flex-1" />
                                                {index > 0 && (
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
                                <Button type="button" onClick={addMembershipEntry} className="mt-2">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add more
                                </Button>
                            </div>

                            {/* Awards */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Awards</h3>
                                {awardEntries.map((entry, index) => (
                                    <div key={entry.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`award-title-${entry.id}`}>Title</Label>
                                            <Input id={`award-title-${entry.id}`} placeholder="Enter here" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`award-desc-${entry.id}`}>Description</Label>
                                            <Input id={`award-desc-${entry.id}`} placeholder="Enter here" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`award-year-${entry.id}`}>Year</Label>
                                            <div className="flex gap-2">
                                                <Input id={`award-year-${entry.id}`} type="date" placeholder="mm/dd/yyyy" className="flex-1" />
                                                {index > 0 && (
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
                                <Button type="button" onClick={addAwardEntry} className="mt-2">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add more
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Save Button */}
                <div className="mt-8 flex justify-center">
                    <Button className="w-full max-w-md">
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
