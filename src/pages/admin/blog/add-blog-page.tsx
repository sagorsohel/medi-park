"use client";

import { useState, useEffect, startTransition } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Loader2 } from "lucide-react";
import {
    useGetBlogByIdQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    type Blog,
} from "@/services/blogApi";
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
        [{ align: [] }],
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

export default function AddBlogPage() {
    const navigate = useNavigate();
    const params = useParams<{ id?: string }>();
    const blogId = params.id ? parseInt(params.id) : null;
    const pathname = window.location.pathname;
    const isViewMode = pathname.includes("/view/");
    const isEditMode = pathname.includes("/edit/");
    const isCreateMode = !blogId && !isEditMode && !isViewMode;

    const { data: blogData, isLoading } = useGetBlogByIdQuery(blogId!, { skip: !blogId });
    const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
    const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

    // Compute initial form data from API response or use defaults
    const initialFormData = blogData?.data && blogId
        ? {
            title: blogData.data.title || "",
            description: blogData.data.description || "",
            status: blogData.data.status || "inactive",
            author_name: blogData.data.author_name || "",
            author_designation: blogData.data.author_designation || "",
        }
        : {
            title: "",
            description: "",
            status: "inactive" as "active" | "inactive",
            author_name: "",
            author_designation: "",
        };

    const [formData, setFormData] = useState(initialFormData);

    const [featureImageFile, setFeatureImageFile] = useState<File | null>(null);
    const [featureImagePreview, setFeatureImagePreview] = useState<string | null>(
        blogData?.data?.feature_image || null
    );
    const [authorImageFile, setAuthorImageFile] = useState<File | null>(null);
    const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(
        blogData?.data?.author_image || null
    );

    // Update form data when blogData changes (for edit mode)
    // This effect syncs external API data to component state
    // Note: Syncing external API data to form state via useEffect is a standard React pattern
    // This is necessary because API data loads asynchronously and cannot be used in useState initializer
    useEffect(() => {
        if (blogData?.data && blogId) {
            const blog: Blog = blogData.data;
            // Use startTransition to batch state updates and mark them as non-urgent
            startTransition(() => {
                setFormData({
                    title: blog.title || "",
                    description: blog.description || "",
                    status: blog.status || "inactive",
                    author_name: blog.author_name || "",
                    author_designation: blog.author_designation || "",
                });
                setFeatureImagePreview(blog.feature_image || null);
                setAuthorImagePreview(blog.author_image || null);
            });
        }
    }, [blogData?.data, blogId]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFeatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeatureImageFile(file);
            setFeatureImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAuthorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAuthorImageFile(file);
            setAuthorImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (isCreateMode && !featureImageFile) {
            toast.error("Please select a feature image");
            return;
        }

        if (isCreateMode && (!formData.author_name.trim() || !formData.author_designation.trim())) {
            toast.error("Please fill in author information");
            return;
        }

        try {
            if (isEditMode && blogId) {
                const updatePayload: {
                    title?: string;
                    description?: string;
                    feature_image?: File;
                    status?: "active" | "inactive";
                    author_name?: string;
                    author_image?: File;
                    author_designation?: string;
                } = {
                    title: formData.title,
                    description: formData.description,
                    status: formData.status,
                    author_name: formData.author_name,
                    author_designation: formData.author_designation,
                };

                if (featureImageFile) {
                    updatePayload.feature_image = featureImageFile;
                }
                if (authorImageFile) {
                    updatePayload.author_image = authorImageFile;
                }

                await updateBlog({ id: blogId, data: updatePayload }).unwrap();
                toast.success("Blog updated successfully!");
            } else {
                if (!featureImageFile) {
                    toast.error("Please select a feature image");
                    return;
                }

                await createBlog({
                    title: formData.title,
                    description: formData.description,
                    feature_image: featureImageFile,
                    author_name: formData.author_name,
                    author_designation: formData.author_designation,
                    author_image: authorImageFile || "",
                    status: formData.status,
                }).unwrap();
                toast.success("Blog created successfully!");
            }
            navigate("/admin/blog");
        } catch (error: unknown) {
            console.error("Failed to save blog:", error);
            const errorMessage =
                (error &&
                    typeof error === "object" &&
                    "data" in error &&
                    error.data &&
                    typeof error.data === "object" &&
                    "message" in error.data &&
                    typeof error.data.message === "string")
                    ? error.data.message
                    : "Failed to save blog. Please try again.";
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
                    onClick={() => navigate("/admin/blog")}
                    className="mb-4"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Blogs
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isCreateMode ? "Create" : isEditMode ? "Edit" : "View"} Blog
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            disabled={isViewMode}
                            required
                            placeholder="Enter blog title"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <Label htmlFor="description">Description *</Label>
                        <div className="bg-white">
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => handleChange("description", value)}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Enter blog description"
                                readOnly={isViewMode}
                            />
                        </div>
                    </div>

                    {/* Feature Image */}
                    <div className="md:col-span-2">
                        <Label htmlFor="feature_image">
                            Feature Image {isEditMode && "(Leave empty to keep current)"} *
                        </Label>
                        <div className="space-y-2">
                            <Input
                                id="feature_image"
                                type="file"
                                accept="image/*"
                                onChange={handleFeatureImageChange}
                                disabled={isViewMode}
                                required={isCreateMode}
                            />
                            {(featureImagePreview || (blogData?.data && blogData.data.feature_image)) && (
                                <img
                                    src={featureImagePreview || blogData?.data?.feature_image || ""}
                                    alt="Feature preview"
                                    className="w-32 h-32 object-cover rounded border"
                                />
                            )}
                        </div>
                    </div>

                    {/* Author Name */}
                    <div>
                        <Label htmlFor="author_name">Author Name *</Label>
                        <Input
                            id="author_name"
                            value={formData.author_name}
                            onChange={(e) => handleChange("author_name", e.target.value)}
                            disabled={isViewMode}
                            required
                            placeholder="Enter author name"
                        />
                    </div>

                    {/* Author Designation */}
                    <div>
                        <Label htmlFor="author_designation">Author Designation *</Label>
                        <Input
                            id="author_designation"
                            value={formData.author_designation}
                            onChange={(e) => handleChange("author_designation", e.target.value)}
                            disabled={isViewMode}
                            required
                            placeholder="Enter author designation"
                        />
                    </div>

                    {/* Author Image */}
                    <div className="md:col-span-2">
                        <Label htmlFor="author_image">
                            Author Image {isEditMode && "(Leave empty to keep current)"}
                        </Label>
                        <div className="space-y-2">
                            <Input
                                id="author_image"
                                type="file"
                                accept="image/*"
                                onChange={handleAuthorImageChange}
                                disabled={isViewMode}
                            />
                            {(authorImagePreview || (blogData?.data && blogData.data.author_image)) && (
                                <img
                                    src={authorImagePreview || blogData?.data?.author_image || ""}
                                    alt="Author preview"
                                    className="w-32 h-32 object-cover rounded border"
                                />
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleChange("status", value as "active" | "inactive")}
                            disabled={isViewMode}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {!isViewMode && (
                    <div className="mt-6 flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/admin/blog")}
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

