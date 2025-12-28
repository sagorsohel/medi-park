"use client";

import { useState, useEffect, startTransition } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { ChevronLeft, Loader2, Plus, X, GripVertical, Check, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
    useGetFacilityByIdQuery,
    useCreateFacilityMutation,
    useUpdateFacilityMutation,
    type Facility,
} from "@/services/homepageApi";
import { useGetDoctorsQuery } from "@/services/doctorApi";
import { useGetBlogsQuery } from "@/services/blogApi";
import toast from "react-hot-toast";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image", "video"],
        [{ color: [] }, { background: [] }],
        ["clean"],
    ],
};

const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
];

interface AccordionItem {
    title: string;
    description: string;
}

export default function AddFacilityPage() {
    const navigate = useNavigate();
    const params = useParams<{ id?: string }>();
    const facilityId = params.id ? parseInt(params.id) : null;
    const pathname = window.location.pathname;
    const isViewMode = pathname.includes("/view/");
    const isEditMode = pathname.includes("/edit/");
    const isCreateMode = !facilityId && !isEditMode && !isViewMode;

    const { data: facilityData, isLoading } = useGetFacilityByIdQuery(facilityId!, { skip: !facilityId });
    const { data: doctorsData } = useGetDoctorsQuery(1);
    const { data: blogsData } = useGetBlogsQuery(1);
    const [createFacility, { isLoading: isCreating }] = useCreateFacilityMutation();
    const [updateFacility, { isLoading: isUpdating }] = useUpdateFacilityMutation();

    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [description1, setDescription1] = useState("");
    const [description2, setDescription2] = useState("");
    const [footer, setFooter] = useState("");
    const [status, setStatus] = useState<"active" | "inactive">("inactive");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [accordions, setAccordions] = useState<AccordionItem[]>([]);
    const [openAccordions, setOpenAccordions] = useState<Set<number>>(new Set());
    const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
    const [selectedBlogs, setSelectedBlogs] = useState<number[]>([]);

    const toggleAccordion = (index: number) => {
        setOpenAccordions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    // Update form data when facilityData changes (for edit/view mode)
    useEffect(() => {
        if (facilityData?.data && facilityId) {
            const facility: Facility = facilityData.data;
            startTransition(() => {
                setTitle(facility.title || "");
                setShortDescription(facility.short_description || "");
                setDescription1(facility.description1 || "");
                setDescription2(facility.description2 || "");
                setFooter(facility.footer || "");
                setStatus(facility.status || "inactive");
                setImagePreview(facility.image || null);
                setAccordions(facility.accordions || []);
                
                // Handle doctors - extract IDs if they're objects
                if (facility.doctors) {
                    const doctorIds = facility.doctors.map((doc: number | { id: number }) => typeof doc === 'number' ? doc : doc.id);
                    setSelectedDoctors(doctorIds);
                } else {
                    setSelectedDoctors([]);
                }
                
                // Handle blogs - extract IDs if they're objects
                if (facility.blogs) {
                    const blogIds = facility.blogs.map((blog: number | { id: number }) => typeof blog === 'number' ? blog : blog.id);
                    setSelectedBlogs(blogIds);
                } else {
                    setSelectedBlogs([]);
                }
            });
        }
    }, [facilityData, facilityId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const addAccordion = () => {
        const newIndex = accordions.length;
        setAccordions([...accordions, { title: "", description: "" }]);
        // Auto-expand the new accordion
        setOpenAccordions(prev => new Set(prev).add(newIndex));
    };

    const removeAccordion = (index: number) => {
        setAccordions(accordions.filter((_, i) => i !== index));
    };

    const updateAccordion = (index: number, field: 'title' | 'description', value: string) => {
        const newAccordions = accordions.map((accordion, i) => {
            if (i === index) {
                return { ...accordion, [field]: value };
            }
            return accordion;
        });
        setAccordions(newAccordions);
    };

    const handleSubmit = async () => {
        if (isViewMode) return;

        if (!title.trim() || !shortDescription.trim()) {
            toast.error("Title and short description are required.");
            return;
        }

        if (isCreateMode && !imageFile) {
            toast.error("Please select an image.");
            return;
        }

        try {
            const payload = {
                title,
                short_description: shortDescription,
                description1: description1 || undefined,
                description2: description2 || undefined,
                footer: footer || undefined,
                status,
                image: imageFile || imagePreview || "",
                accordions: accordions.length > 0 ? accordions : undefined,
                doctors: selectedDoctors.length > 0 ? selectedDoctors : undefined,
                blogs: selectedBlogs.length > 0 ? selectedBlogs : undefined,
            };

            if (isEditMode && facilityId) {
                await updateFacility({ id: facilityId, data: payload }).unwrap();
                toast.success("Facility updated successfully!");
            } else {
                await createFacility(payload).unwrap();
                toast.success("Facility created successfully!");
            }
            navigate("/admin/website/facilities");
        } catch (error: unknown) {
            console.error("Failed to save facility:", error);
            const errorMessage = (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data && typeof error.data.message === 'string')
                ? error.data.message
                : "Failed to save facility. Please try again.";
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
                    onClick={() => navigate("/admin/website/facilities")}
                    className="mb-4"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Facilities
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isViewMode ? "View Facility" : isEditMode ? "Edit Facility" : "Add New Facility"}
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                <Field>
                    <FieldLabel>Title *</FieldLabel>
                    <FieldContent>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter facility title"
                            disabled={isViewMode}
                        />
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel>Short Description *</FieldLabel>
                    <FieldContent>
                        {isViewMode ? (
                            <div 
                                className="text-gray-700 prose max-w-none border p-4 rounded"
                                dangerouslySetInnerHTML={{ __html: shortDescription }}
                            />
                        ) : (
                            <div className="bg-white">
                                <style>{`
                                    .quill-editor .ql-container {
                                        min-height: 200px;
                                        height: 200px;
                                    }
                                `}</style>
                                <div className="quill-editor">
                                    <ReactQuill
                                        theme="snow"
                                        value={shortDescription}
                                        onChange={setShortDescription}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter short description"
                                    />
                                </div>
                            </div>
                        )}
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel>Description 1</FieldLabel>
                    <FieldContent>
                        {isViewMode ? (
                            <div 
                                className="text-gray-700 prose max-w-none border p-4 rounded"
                                dangerouslySetInnerHTML={{ __html: description1 || '' }}
                            />
                        ) : (
                            <div className="bg-white">
                                <style>{`
                                    .quill-editor .ql-container {
                                        min-height: 200px;
                                        height: 200px;
                                    }
                                `}</style>
                                <div className="quill-editor">
                                    <ReactQuill
                                        theme="snow"
                                        value={description1}
                                        onChange={setDescription1}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter description 1"
                                    />
                                </div>
                            </div>
                        )}
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel>Description 2</FieldLabel>
                    <FieldContent>
                        {isViewMode ? (
                            <div 
                                className="text-gray-700 prose max-w-none border p-4 rounded"
                                dangerouslySetInnerHTML={{ __html: description2 || '' }}
                            />
                        ) : (
                            <div className="bg-white">
                                <style>{`
                                    .quill-editor .ql-container {
                                        min-height: 200px;
                                        height: 200px;
                                    }
                                `}</style>
                                <div className="quill-editor">
                                    <ReactQuill
                                        theme="snow"
                                        value={description2}
                                        onChange={setDescription2}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter description 2"
                                    />
                                </div>
                            </div>
                        )}
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel>Footer</FieldLabel>
                    <FieldContent>
                        {isViewMode ? (
                            <div 
                                className="text-gray-700 prose max-w-none border p-4 rounded"
                                dangerouslySetInnerHTML={{ __html: footer || '' }}
                            />
                        ) : (
                            <div className="bg-white">
                                <style>{`
                                    .quill-editor .ql-container {
                                        min-height: 200px;
                                        height: 200px;
                                    }
                                `}</style>
                                <div className="quill-editor">
                                    <ReactQuill
                                        theme="snow"
                                        value={footer}
                                        onChange={setFooter}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter footer text"
                                    />
                                </div>
                            </div>
                        )}
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel>Image {isCreateMode && '*'}</FieldLabel>
                    <FieldContent>
                        {isViewMode ? (
                            imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt={title}
                                    className="w-full max-w-md h-64 object-cover rounded border"
                                />
                            )
                        ) : (
                            <div className="space-y-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-w-md h-64 object-cover rounded border"
                                    />
                                )}
                            </div>
                        )}
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel>Status</FieldLabel>
                    <FieldContent>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            disabled={isViewMode}
                        >
                            <option value="inactive">Inactive</option>
                            <option value="active">Active</option>
                        </select>
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel>Accordions</FieldLabel>
                    <FieldContent>
                        {isViewMode ? (
                            <div className="space-y-2">
                                {accordions.map((accordion, index) => (
                                    <Collapsible
                                        key={index}
                                        open={openAccordions.has(index)}
                                        onOpenChange={() => toggleAccordion(index)}
                                    >
                                        <div className="border rounded-md">
                                            <CollapsibleTrigger className="w-full">
                                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                                    <h4 className="font-semibold text-left">{accordion.title || `Accordion ${index + 1}`}</h4>
                                                    <ChevronDown
                                                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                                            openAccordions.has(index) ? 'transform rotate-180' : ''
                                                        }`}
                                                    />
                                                </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                                <div className="px-4 pb-4">
                                                    <div 
                                                        className="text-gray-700 prose max-w-none text-sm"
                                                        dangerouslySetInnerHTML={{ __html: accordion.description }}
                                                    />
                                                </div>
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>
                                ))}
                                {accordions.length === 0 && <p className="text-gray-500">No accordions</p>}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {accordions.map((accordion, index) => (
                                    <Collapsible
                                        key={index}
                                        open={openAccordions.has(index)}
                                        onOpenChange={() => toggleAccordion(index)}
                                    >
                                        <div className="border rounded-md">
                                            <div className="flex items-center gap-2 p-3">
                                                <GripVertical className="w-4 h-4 text-gray-400" />
                                                <Input
                                                    value={accordion.title}
                                                    onChange={(e) => updateAccordion(index, 'title', e.target.value)}
                                                    placeholder="Accordion title"
                                                    className="flex-1"
                                                />
                                                <CollapsibleTrigger className="p-1 hover:bg-gray-100 rounded transition-colors">
                                                    <ChevronDown
                                                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                                            openAccordions.has(index) ? 'transform rotate-180' : ''
                                                        }`}
                                                    />
                                                </CollapsibleTrigger>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeAccordion(index);
                                                        setOpenAccordions(prev => {
                                                            const newSet = new Set(prev);
                                                            newSet.delete(index);
                                                            return newSet;
                                                        });
                                                    }}
                                                    className="text-red-500"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                                <div className="p-3 pt-0 bg-white">
                                                    <style>{`
                                                        .quill-editor-small .ql-container {
                                                            min-height: 150px;
                                                            height: 150px;
                                                        }
                                                    `}</style>
                                                    <div className="quill-editor-small">
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={accordion.description}
                                                            onChange={(value) => updateAccordion(index, 'description', value)}
                                                            modules={quillModules}
                                                            formats={quillFormats}
                                                            placeholder="Accordion description"
                                                        />
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addAccordion}
                                    className="w-full"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Accordion
                                </Button>
                            </div>
                        )}
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel>Doctors</FieldLabel>
                    <FieldContent>
                        {isViewMode ? (
                            <div className="space-y-4">
                                {facilityData?.data?.doctors && Array.isArray(facilityData.data.doctors) && facilityData.data.doctors.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {facilityData.data.doctors.map((doctor: number | { id: number; doctor_name: string; department: string; specialist: string; image?: string }) => {
                                            const doctorObj = typeof doctor === 'object' ? doctor : doctorsData?.data?.find(d => d.id === doctor);
                                            if (!doctorObj) return null;
                                            return (
                                                <Card key={doctorObj.id} className="overflow-hidden">
                                                    <CardContent className="p-4">
                                                        <div className="flex flex-col items-center text-center">
                                                            <img
                                                                src={doctorObj.image || "/vite.svg"}
                                                                alt={doctorObj.doctor_name}
                                                                className="w-24 h-24 object-cover rounded-full border-4 border-blue-200 mb-3"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = "/vite.svg";
                                                                }}
                                                            />
                                                            <h4 className="font-semibold text-lg mb-1">{doctorObj.doctor_name}</h4>
                                                            <p className="text-sm text-gray-600 mb-1">{doctorObj.specialist || doctorObj.department}</p>
                                                            <p className="text-xs text-gray-500">{doctorObj.department}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No doctors assigned</p>
                                )}
                            </div>
                        ) : (
                            <div className="border border-gray-300 rounded-md max-h-[400px] overflow-y-auto">
                                {doctorsData?.data && doctorsData.data.length > 0 ? (
                                    <div className="p-2 space-y-2">
                                        {doctorsData.data.map((doctor) => {
                                            const isSelected = selectedDoctors.includes(doctor.id);
                                            const isAlreadyAdded = isEditMode && facilityData?.data?.doctors && 
                                                Array.isArray(facilityData.data.doctors) &&
                                                facilityData.data.doctors.some((d: number | { id: number }) => {
                                                    const doctorId = typeof d === 'number' ? d : d.id;
                                                    return doctorId === doctor.id;
                                                });
                                            
                                            return (
                                                <div
                                                    key={doctor.id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedDoctors(selectedDoctors.filter(id => id !== doctor.id));
                                                        } else {
                                                            setSelectedDoctors([...selectedDoctors, doctor.id]);
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                                                        isSelected ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        {doctor.image && (
                                                            <img
                                                                src={doctor.image}
                                                                alt={doctor.doctor_name}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                }}
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">{doctor.doctor_name}</p>
                                                            <p className="text-xs text-gray-500">{doctor.specialist || doctor.department}</p>
                                                            {isAlreadyAdded && !isSelected && (
                                                                <p className="text-xs text-green-600 mt-1">Already added</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <Check className="w-5 h-5 text-blue-600" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="p-4 text-center text-gray-500">No doctors available</p>
                                )}
                            </div>
                        )}
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel>Blogs</FieldLabel>
                    <FieldContent>
                        {isViewMode ? (
                            <div className="space-y-4">
                                {facilityData?.data?.blogs && Array.isArray(facilityData.data.blogs) && facilityData.data.blogs.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {facilityData.data.blogs.map((blog: number | { id: number; title: string; description: string; feature_image?: string }) => {
                                            const blogObj = typeof blog === 'object' ? blog : blogsData?.data?.find(b => b.id === blog);
                                            if (!blogObj) return null;
                                            return (
                                                <Card key={blogObj.id} className="overflow-hidden">
                                                    <CardContent className="p-0">
                                                        {blogObj.feature_image && (
                                                            <img
                                                                src={blogObj.feature_image}
                                                                alt={blogObj.title}
                                                                className="w-full h-40 object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = "/vite.svg";
                                                                }}
                                                            />
                                                        )}
                                                        <div className="p-4">
                                                            <h4 className="font-semibold text-lg mb-2 line-clamp-2">{blogObj.title}</h4>
                                                            <div 
                                                                className="text-sm text-gray-600 line-clamp-3 prose max-w-none"
                                                                dangerouslySetInnerHTML={{ __html: blogObj.description?.substring(0, 150) + '...' || '' }}
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No blogs assigned</p>
                                )}
                            </div>
                        ) : (
                            <div className="border border-gray-300 rounded-md max-h-[400px] overflow-y-auto">
                                {blogsData?.data && blogsData.data.length > 0 ? (
                                    <div className="p-2 space-y-2">
                                        {blogsData.data.map((blog) => {
                                            const isSelected = selectedBlogs.includes(blog.id);
                                            const isAlreadyAdded = isEditMode && facilityData?.data?.blogs && 
                                                Array.isArray(facilityData.data.blogs) &&
                                                facilityData.data.blogs.some((b: number | { id: number }) => {
                                                    const blogId = typeof b === 'number' ? b : b.id;
                                                    return blogId === blog.id;
                                                });
                                            
                                            return (
                                                <div
                                                    key={blog.id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedBlogs(selectedBlogs.filter(id => id !== blog.id));
                                                        } else {
                                                            setSelectedBlogs([...selectedBlogs, blog.id]);
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                                                        isSelected ? 'bg-green-50 border-green-300' : 'border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        {blog.feature_image && (
                                                            <img
                                                                src={blog.feature_image}
                                                                alt={blog.title}
                                                                className="w-12 h-12 rounded object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                }}
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm line-clamp-1">{blog.title}</p>
                                                            <div 
                                                                className="text-xs text-gray-500 line-clamp-2 prose max-w-none"
                                                                dangerouslySetInnerHTML={{ __html: blog.description?.substring(0, 100) + '...' || '' }}
                                                            />
                                                            {isAlreadyAdded && !isSelected && (
                                                                <p className="text-xs text-green-600 mt-1">Already added</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <Check className="w-5 h-5 text-green-600" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="p-4 text-center text-gray-500">No blogs available</p>
                                )}
                            </div>
                        )}
                    </FieldContent>
                </Field>

                {!isViewMode && (
                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/admin/website/facilities")}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isCreating || isUpdating}
                        >
                            {(isCreating || isUpdating) ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {isEditMode ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                isEditMode ? "Update Facility" : "Create Facility"
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

