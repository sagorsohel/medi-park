"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Loader2, Plus, Trash2, Edit2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
    useGetBlogsQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    type Blog,
} from "@/services/blogApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface DraftBlog {
    id: string;
    title: string;
    description: string;
    feature_image: string;
    status: "active" | "inactive";
    author_name: string;
    author_image: string;
    author_designation: string;
    featureImageFile?: File;
    authorImageFile?: File;
}

interface EditableBlog {
    title?: string;
    description?: string;
    feature_image?: string | File;
    status?: "active" | "inactive";
    author_name?: string;
    author_image?: string | File;
    author_designation?: string;
}

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

export function BlogManage() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, error, refetch } = useGetBlogsQuery(currentPage);
    const [createBlog] = useCreateBlogMutation();
    const [updateBlog] = useUpdateBlogMutation();
    const [deleteBlog] = useDeleteBlogMutation();

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<number | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [formData, setFormData] = useState<DraftBlog>({
        id: "",
        title: "",
        description: "",
        feature_image: "",
        status: "inactive",
        author_name: "",
        author_image: "",
        author_designation: "",
    });
    const [imagePreviews, setImagePreviews] = useState<{ feature_image?: string; author_image?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setFormData({
            id: "",
            title: "",
            description: "",
            feature_image: "",
            status: "inactive",
            author_name: "",
            author_image: "",
            author_designation: "",
        });
        setImagePreviews({});
    };

    const openCreateModal = () => {
        resetForm();
        setCreateModalOpen(true);
    };

    const openEditModal = (blog: Blog) => {
        setEditingBlog(blog);
        setFormData({
            id: blog.id.toString(),
            title: blog.title,
            description: blog.description,
            feature_image: blog.feature_image,
            status: blog.status,
            author_name: blog.author_name,
            author_image: blog.author_image,
            author_designation: blog.author_designation,
        });
        setImagePreviews({
            feature_image: blog.feature_image,
            author_image: blog.author_image,
        });
        setEditModalOpen(true);
    };

    const closeModals = () => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setEditingBlog(null);
        resetForm();
    };

    const handleDeleteClick = (id: number) => {
        setBlogToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (blogToDelete === null) return;

        try {
            await deleteBlog(blogToDelete).unwrap();
            refetch();
            setBlogToDelete(null);
            toast.success("Blog deleted successfully!");
        } catch (error) {
            console.error("Failed to delete blog:", error);
            toast.error("Failed to delete blog. Please try again.");
        }
    };

    const handleFieldChange = (field: keyof DraftBlog, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageChange = (field: "feature_image" | "author_image", file: File | null) => {
        if (!file) {
            setImagePreviews((prev) => {
                const newPreviews = { ...prev };
                delete newPreviews[field];
                return newPreviews;
            });
            setFormData((prev) => ({
                ...prev,
                [field === "feature_image" ? "featureImageFile" : "authorImageFile"]: undefined,
            }));
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setImagePreviews((prev) => ({
            ...prev,
            [field]: previewUrl,
        }));

        setFormData((prev) => ({
            ...prev,
            [field === "feature_image" ? "featureImageFile" : "authorImageFile"]: file,
        }));
    };

    const handleCreateBlog = async () => {
        if (!formData.title.trim() || !formData.description.trim() || !formData.featureImageFile || !formData.author_name.trim() || !formData.author_designation.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            await createBlog({
                title: formData.title,
                description: formData.description,
                feature_image: formData.featureImageFile,
                author_name: formData.author_name,
                author_designation: formData.author_designation,
                author_image: formData.authorImageFile || "",
                status: formData.status,
            }).unwrap();

            refetch();
            closeModals();
            toast.success("Blog created successfully!");
        } catch (error) {
            console.error("Failed to create blog:", error);
            toast.error("Failed to create blog. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateBlog = async () => {
        if (!editingBlog) return;

        if (!formData.title.trim() || !formData.description.trim() || !formData.author_name.trim() || !formData.author_designation.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            const updatePayload: EditableBlog = {
                title: formData.title,
                description: formData.description,
                author_name: formData.author_name,
                author_designation: formData.author_designation,
                status: formData.status,
            };

            if (formData.featureImageFile) {
                updatePayload.feature_image = formData.featureImageFile;
            }
            if (formData.authorImageFile) {
                updatePayload.author_image = formData.authorImageFile;
            }

            await updateBlog({
                id: editingBlog.id,
                data: updatePayload,
            }).unwrap();

            refetch();
            closeModals();
            toast.success("Blog updated successfully!");
        } catch (error) {
            console.error("Failed to update blog:", error);
            toast.error("Failed to update blog. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const blogList = data?.data || [];
    const pagination = data?.pagination;

    return (
        <Card className="mt-8 p-5">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Blog Management</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Button onClick={openCreateModal} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Blog
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">
                        Failed to load blogs. Please try again.
                    </div>
                ) : (
                    <>
                        {blogList.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No blogs found. Click "Add Blog" to create one.
                            </div>
                        ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 {blogList.map((blog) => (
                                     <Card 
                                         key={blog.id} 
                                         className={`border ${
                                             blog.status === "active" 
                                                 ? "bg-green-100 border-green-200" 
                                                 : "bg-red-100 border-red-200"
                                         }`}
                                     >
                                         <CardHeader className="pb-4">
                                             <div className="flex items-center justify-between">
                                                 <CardTitle className="text-lg line-clamp-1">{blog.title}</CardTitle>
                                                 <div className="flex items-center gap-2">
                                                     <Button variant="outline" size="sm" onClick={() => openEditModal(blog)}>
                                                         <Edit2 className="w-4 h-4 mr-1" />
                                                         Edit
                                                     </Button>
                                                     <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(blog.id)}>
                                                         <Trash2 className="w-4 h-4 mr-1" />
                                                         Delete
                                                     </Button>
                                                 </div>
                                             </div>
                                         </CardHeader>
                                         <CardContent className="space-y-4 p-5">
                                            <Field>
                                                <FieldContent>
                                                    <img
                                                        src={blog.feature_image}
                                                        alt={blog.title}
                                                        className="w-full h-32 object-cover rounded border"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = "/vite.svg";
                                                        }}
                                                    />
                                                </FieldContent>
                                            </Field>
                                            <Field>
                                                <FieldContent>
                                                    <p className="text-gray-700 line-clamp-2">{blog.title}</p>
                                                </FieldContent>
                                            </Field>

                                            <Field>
                                                <FieldContent>
                                                    <p className="text-gray-700">{blog.author_name}</p>
                                                    <p className="text-sm text-gray-500">{blog.author_designation}</p>
                                                </FieldContent>
                                            </Field>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {pagination && pagination.total_page > 1 && (
                            <DataTablePagination
                                currentPage={pagination.current_page}
                                totalPages={pagination.total_page}
                                totalEntries={pagination.total_count}
                                entriesPerPage={pagination.per_page}
                                onPageChange={setCurrentPage}
                                showingFrom={(pagination.current_page - 1) * pagination.per_page + 1}
                                showingTo={Math.min(pagination.current_page * pagination.per_page, pagination.total_count)}
                            />
                        )}
                    </>
                )}

                <ConfirmDialog
                    open={deleteConfirmOpen}
                    onOpenChange={setDeleteConfirmOpen}
                    onConfirm={confirmDelete}
                    title="Delete Blog"
                    description="Are you sure you want to delete this blog? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="destructive"
                />

                <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Blog</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Field>
                                <FieldLabel>Title *</FieldLabel>
                                <FieldContent>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => handleFieldChange("title", e.target.value)}
                                        placeholder="Enter blog title"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Description *</FieldLabel>
                                <FieldContent>
                                    <div className="bg-white">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.description}
                                            onChange={(value) => handleFieldChange("description", value)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Enter blog description"
                                        />
                                    </div>
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Feature Image *</FieldLabel>
                                <FieldContent>
                                    <div className="space-y-2">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange("feature_image", e.target.files?.[0] || null)}
                                        />
                                        {imagePreviews.feature_image && (
                                            <img
                                                src={imagePreviews.feature_image}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded border"
                                            />
                                        )}
                                    </div>
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Author Name *</FieldLabel>
                                <FieldContent>
                                    <Input
                                        value={formData.author_name}
                                        onChange={(e) => handleFieldChange("author_name", e.target.value)}
                                        placeholder="Enter author name"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Author Designation *</FieldLabel>
                                <FieldContent>
                                    <Input
                                        value={formData.author_designation}
                                        onChange={(e) => handleFieldChange("author_designation", e.target.value)}
                                        placeholder="Enter author designation"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Author Image</FieldLabel>
                                <FieldContent>
                                    <div className="space-y-2">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange("author_image", e.target.files?.[0] || null)}
                                        />
                                        {imagePreviews.author_image && (
                                            <img
                                                src={imagePreviews.author_image}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded border"
                                            />
                                        )}
                                    </div>
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Status</FieldLabel>
                                <FieldContent>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleFieldChange("status", e.target.value as "active" | "inactive")}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="inactive">Inactive</option>
                                        <option value="active">Active</option>
                                    </select>
                                </FieldContent>
                            </Field>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeModals} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateBlog} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Blog"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Blog</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Field>
                                <FieldLabel>Title *</FieldLabel>
                                <FieldContent>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => handleFieldChange("title", e.target.value)}
                                        placeholder="Enter blog title"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Description *</FieldLabel>
                                <FieldContent>
                                    <div className="bg-white">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.description}
                                            onChange={(value) => handleFieldChange("description", value)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                        />
                                    </div>
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Feature Image {editingBlog && "(Leave empty to keep current)"}</FieldLabel>
                                <FieldContent>
                                    <div className="space-y-2">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange("feature_image", e.target.files?.[0] || null)}
                                        />
                                        {(imagePreviews.feature_image || (editingBlog && editingBlog.feature_image)) && (
                                            <img
                                                src={imagePreviews.feature_image || (editingBlog?.feature_image || "")}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded border"
                                            />
                                        )}
                                    </div>
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Author Name *</FieldLabel>
                                <FieldContent>
                                    <Input
                                        value={formData.author_name}
                                        onChange={(e) => handleFieldChange("author_name", e.target.value)}
                                        placeholder="Enter author name"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Author Designation *</FieldLabel>
                                <FieldContent>
                                    <Input
                                        value={formData.author_designation}
                                        onChange={(e) => handleFieldChange("author_designation", e.target.value)}
                                        placeholder="Enter author designation"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Author Image {editingBlog && "(Leave empty to keep current)"}</FieldLabel>
                                <FieldContent>
                                    <div className="space-y-2">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange("author_image", e.target.files?.[0] || null)}
                                        />
                                        {(imagePreviews.author_image || (editingBlog && editingBlog.author_image)) && (
                                            <img
                                                src={imagePreviews.author_image || (editingBlog?.author_image || "")}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded border"
                                            />
                                        )}
                                    </div>
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Status</FieldLabel>
                                <FieldContent>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleFieldChange("status", e.target.value as "active" | "inactive")}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="inactive">Inactive</option>
                                        <option value="active">Active</option>
                                    </select>
                                </FieldContent>
                            </Field>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeModals} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateBlog} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Blog"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

