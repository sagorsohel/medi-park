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
                    <TabsList className="mb-6">
                        <TabsTrigger value="basic">Basic Information</TabsTrigger>
                        <TabsTrigger value="extra">Extra Information</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                        {/* Basic Information content can be added here */}
                        <p className="text-gray-500">Basic information form fields go here</p>
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
