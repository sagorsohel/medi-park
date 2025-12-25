"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit2, Trash2 } from "lucide-react";
import { useGetNewsQuery, useDeleteNewsMutation } from "@/services/newsApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import toast from "react-hot-toast";
import { NewsPageBannerManage } from "@/components/admin/news-page-banner-manage";

export default function NewsPageManage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<number | null>(null);

    const { data, isLoading, refetch } = useGetNewsQuery(currentPage);
    const [deleteNews] = useDeleteNewsMutation();

    // Filter and search news
    const filteredNews = useMemo(() => {
        if (!data?.data) return [];

        let result = data.data;

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (news) =>
                    news.title.toLowerCase().includes(query) ||
                    news.author_name.toLowerCase().includes(query) ||
                    news.author_designation.toLowerCase().includes(query)
            );
        }

        // Apply filter
        if (filter === "active") {
            result = result.filter((news) => news.status === "active");
        } else if (filter === "inactive") {
            result = result.filter((news) => news.status === "inactive");
        }

        return result;
    }, [searchQuery, filter, data]);

    const pagination = data?.pagination;
    const showingFrom = pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
    const showingTo = pagination
        ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
        : 0;

    const handleAction = (id: number, action: string) => {
        if (action === "delete") {
            setNewsToDelete(id);
            setDeleteConfirmOpen(true);
        } else if (action === "edit") {
            navigate(`/admin/news/edit/${id}`);
        } else if (action === "view") {
            navigate(`/admin/news/view/${id}`);
        }
    };

    const handleDelete = async () => {
        if (!newsToDelete) return;

        try {
            await deleteNews(newsToDelete).unwrap();
            toast.success("News deleted successfully!");
            setDeleteConfirmOpen(false);
            setNewsToDelete(null);
            refetch();
        } catch (error) {
            console.error("Failed to delete news:", error);
            toast.error("Failed to delete news. Please try again.");
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

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">News</h1>
                    <p className="text-gray-600">Manage news articles and media</p>
                </div>
                <Button onClick={() => navigate("/admin/news/new")}>Add New</Button>
            </div>

            {/* Banner Management */}
            <NewsPageBannerManage />



            <div className="py-8">
                {/* Filters */}
                <DataTableFilters
                    onBulkAction={handleBulkAction}
                    onFilterChange={handleFilterChange}
                    onSearch={setSearchQuery}
                    searchPlaceholder="Search news..."
                />


            </div>

            {/* News List */}
            {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <>
                    {filteredNews.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                            No news found. Click "Add New" to create one.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredNews.map((news) => (
                                <Card
                                    key={news.id}
                                    className={`border ${news.status === "active"
                                            ? "bg-green-50 border-green-200"
                                            : "bg-red-50 border-red-200"
                                        }`}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg line-clamp-1">{news.title}</CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAction(news.id, "edit")}
                                                >
                                                    <Edit2 className="w-4 h-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleAction(news.id, "delete")}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-3">
                                        <div>
                                            <img
                                                src={news.feature_image}
                                                alt={news.title}
                                                className="w-full h-32 object-cover rounded border"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "/vite.svg";
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-gray-700 line-clamp-2">{news.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-medium">{news.author_name}</p>
                                            <p className="text-sm text-gray-500">{news.author_designation}</p>
                                        </div>
                                       
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
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
                onConfirm={handleDelete}
                title="Delete News"
                description="Are you sure you want to delete this news? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}

