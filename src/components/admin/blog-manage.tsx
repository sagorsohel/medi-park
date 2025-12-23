"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Edit2, Trash2, RefreshCw } from "lucide-react";
import {
    useGetBlogsQuery,
    useDeleteBlogMutation,
} from "@/services/blogApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import toast from "react-hot-toast";

export function BlogManage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const { data, isLoading, error, refetch } = useGetBlogsQuery(currentPage);
    const [deleteBlog] = useDeleteBlogMutation();

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

    // Filter and search blogs
    const filteredBlogs = useMemo(() => {
        if (!data?.data) return [];
        
        let result = data.data;

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (blog) =>
                    blog.title.toLowerCase().includes(query) ||
                    blog.author_name.toLowerCase().includes(query) ||
                    blog.author_designation.toLowerCase().includes(query)
            );
        }

        // Apply filter
        if (filter === "active") {
            result = result.filter((blog) => blog.status === "active");
        } else if (filter === "inactive") {
            result = result.filter((blog) => blog.status === "inactive");
        }

        return result;
    }, [searchQuery, filter, data]);

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

    const handleAction = (id: number, action: string) => {
        if (action === "delete") {
            handleDeleteClick(id);
        } else if (action === "edit") {
            navigate(`/admin/blog/edit/${id}`);
        }
    };

    const handleBulkAction = (action: string) => {
        console.log(`Bulk action: ${action}`);
        // Handle bulk actions
    };

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const blogList = filteredBlogs;
    const pagination = data?.pagination;
    const showingFrom = pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
    const showingTo = pagination
        ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
        : 0;

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
                        <Button onClick={() => navigate("/admin/blog/new")} className="flex items-center gap-2">
                            Add Blog
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Filters */}
                <div className="mb-4">
                    <DataTableFilters
                        onBulkAction={handleBulkAction}
                        onFilterChange={handleFilterChange}
                        onSearch={setSearchQuery}
                        searchPlaceholder="Search blogs..."
                    />
                </div>

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
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                        }`}
                                    >
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg line-clamp-1">{blog.title}</CardTitle>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAction(blog.id, "edit")}
                                                    >
                                                        <Edit2 className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleAction(blog.id, "delete")}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4 p-5">
                                            <div>
                                                <img
                                                    src={blog.feature_image}
                                                    alt={blog.title}
                                                    className="w-full h-32 object-cover rounded border"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "/vite.svg";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-gray-700 line-clamp-2">{blog.title}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-700 font-medium">{blog.author_name}</p>
                                                <p className="text-sm text-gray-500">{blog.author_designation}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        blog.status === "active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {blog.status === "active" ? "Active" : "Inactive"}
                                                </span>
                                            </div>
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
                                showingFrom={showingFrom}
                                showingTo={showingTo}
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
            </CardContent>
        </Card>
    );
}

