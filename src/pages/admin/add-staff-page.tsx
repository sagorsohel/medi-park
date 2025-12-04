import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Calendar as CalendarIcon, Upload } from "lucide-react";
import { useNavigate } from "react-router";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AddStaffPage() {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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
                    <h1 className="text-3xl font-bold text-gray-900">Staff</h1>
                </div>
                <p className="text-gray-600 ml-8">Here's what happening in your update</p>
            </div>

            <div className="bg-white rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    {/* Identity Number */}
                    <div className="space-y-2">
                        <Label htmlFor="identityNo">Identity Number</Label>
                        <Input
                            id="identityNo"
                            value="Auto Generate"
                            readOnly
                            className="bg-blue-50/50 text-gray-500 border-blue-100"
                        />
                    </div>

                    {/* Empty column for alignment if needed, or just let it flow */}
                    <div className="hidden md:block"></div>

                    {/* Staff Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Staff Name</Label>
                        <Input id="name" placeholder="Enter here" />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select>
                            <SelectTrigger id="role" className="w-full">
                                <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="doctor">Doctor</SelectItem>
                                <SelectItem value="nurse">Nurse</SelectItem>
                                <SelectItem value="receptionist">Receptionist</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input id="mobile" placeholder="Enter here" />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="Enter here" />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select>
                            <SelectTrigger id="gender" className="w-full">
                                <SelectValue placeholder="Enter here" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Blood Group */}
                    <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select >
                            <SelectTrigger id="bloodGroup" className="w-full">
                                <SelectValue placeholder="Enter here" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <div className="relative">
                            <Input id="dob" type="date" className="block" placeholder="mm/dd/yyyy" />
                        </div>
                    </div>

                    {/* Joining Date */}
                    <div className="space-y-2">
                        <Label htmlFor="joiningDate">Joining Date</Label>
                        <div className="relative">
                            <Input id="joiningDate" type="date" className="block" placeholder="mm/dd/yyyy" />
                        </div>
                    </div>

                    {/* Present Address */}
                    <div className="space-y-2">
                        <Label htmlFor="presentAddress">Present Address</Label>
                        <textarea
                            id="presentAddress"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter here"
                        />
                    </div>

                    {/* Permanent Address */}
                    <div className="space-y-2">
                        <Label htmlFor="permanentAddress">Permanent Address</Label>
                        <textarea
                            id="permanentAddress"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter here"
                        />
                    </div>

                    {/* Salary */}
                    <div className="space-y-2">
                        <Label htmlFor="salary">Salary</Label>
                        <Input id="salary" placeholder="Enter here" />
                    </div>

                    {/* Image Preview Area - Spans 2 rows visually in the design, but here we can just put it in the right column */}
                    <div className="space-y-2 row-span-2">
                        <Label>Image Preview</Label>
                        <div className="border rounded-md p-4 h-[140px] flex items-center justify-center bg-gray-50">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="h-full object-contain" />
                            ) : (
                                <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                                    <svg className="h-10 w-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image Input */}
                    <div className="space-y-2">
                        <Label htmlFor="image">Image</Label>
                        <div className="flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                            <span className="text-muted-foreground">{imagePreview ? "Image Selected" : "Choose File No File Chosen"}</span>
                            <Input
                                id="image"
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                accept="image/*"
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
                    </div>

                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-center">
                    <Button className="w-full max-w-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
