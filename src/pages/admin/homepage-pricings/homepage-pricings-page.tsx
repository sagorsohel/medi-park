"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Search, Edit2, Trash2, Loader2, DollarSign, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
    useGetHomepagePricingsQuery,
    useDeleteHomepagePricingMutation,
    useUpdateHomepagePricingMutation,
} from "@/services/homepagePricingApi";
import toast from "react-hot-toast";

export default function HomepagePricingsPage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [pricingToDelete, setPricingToDelete] = useState<number | null>(null);

    const { data, isLoading } = useGetHomepagePricingsQuery(currentPage);
    const [deletePricing] = useDeleteHomepagePricingMutation();
    const [updatePricing] = useUpdateHomepagePricingMutation();

    const metadata = data?.pagination;

    const handleDeleteClick = (id: number) => {
        setPricingToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!pricingToDelete) return;

        try {
            await deletePricing(pricingToDelete).unwrap();
            toast.success("Pricing deleted successfully");
        } catch (error) {
            toast.error("Failed to delete pricing");
        } finally {
            setDeleteConfirmOpen(false);
            setPricingToDelete(null);
        }
    };

    const handleStatusToggle = async (pricing: any) => {
        const newStatus = pricing.status === "active" ? "inactive" : "active";
        try {
            await updatePricing({
                id: pricing.id,
                data: { status: newStatus },
            }).unwrap();
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredData = data?.data.filter((pricing) =>
        pricing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Homepage Pricings</h1>
                    <p className="text-gray-500">Manage pricing options for the homepage</p>
                </div>
                <Link to="/admin/homepage-pricings/new">
                    <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl font-bold px-6 py-6 shadow-xl shadow-primary/20 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Pricing
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                        <p className="text-gray-400 font-medium">Loading pricing options...</p>
                    </div>
                ) : filteredData?.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                            <DollarSign className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No Pricings Found</h3>
                        <p className="text-gray-500 max-w-sm">
                            You haven't added any pricing sections yet, or none match your search criteria.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredData?.map((pricing) => {
                            let parsedFeatures: string[] = [];
                            try {
                                parsedFeatures = typeof pricing.features === "string"
                                    ? JSON.parse(pricing.features)
                                    : Array.isArray(pricing.features) ? pricing.features : [];
                            } catch (e) {
                                parsedFeatures = [];
                            }

                            return (
                                <div
                                    key={pricing.id}
                                    className={`relative flex flex-col bg-white rounded-3xl p-8 border hover:-translate-y-2 transition-all duration-300 ${pricing.highlight
                                        ? "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary"
                                        : "border-gray-100 shadow-lg hover:shadow-xl"
                                        }`}
                                >
                                    {pricing.highlight && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 mb-2">{pricing.title}</h3>
                                            <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">{pricing.description}</p>
                                        </div>
                                        <button onClick={() => handleStatusToggle(pricing)} className="focus:outline-none shrink-0 ml-4">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    pricing.status === "active"
                                                        ? "bg-green-50 text-green-700 border-green-200 font-bold px-3 py-1 hover:bg-green-100 transition-colors cursor-pointer"
                                                        : "bg-red-50 text-red-700 border-red-200 font-bold px-3 py-1 hover:bg-red-100 transition-colors cursor-pointer"
                                                }
                                            >
                                                <div
                                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${pricing.status === "active" ? "bg-green-500" : "bg-red-500"
                                                        }`}
                                                />
                                                {pricing.status.toUpperCase()}
                                            </Badge>
                                        </button>
                                    </div>

                                    <div className="mb-6 flex items-end gap-1">
                                        <span className="text-4xl font-black text-gray-900">${pricing.price}</span>
                                        <span className="text-gray-500 font-medium pb-1.5">/{pricing.duration}</span>
                                    </div>

                                    {/* Features List Layout */}
                                    <div className="grow space-y-4 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 min-h-[220px]">
                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Included Features</h4>
                                        {parsedFeatures.length > 0 ? (
                                            <ul className="space-y-3">
                                                {parsedFeatures.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start text-sm font-medium text-gray-700 gap-3 relative">
                                                        <div className="mt-0.5 shrink-0 bg-primary/10 p-0.5 rounded-full">
                                                            <Check className="w-4 h-4 text-primary font-bold" />
                                                        </div>
                                                        <span className="leading-snug">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic font-medium py-4">No specific features listed.</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-auto">
                                        <Link to={`/admin/homepage-pricings/edit/${pricing.id}`} className="flex-1">
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 text-blue-600 border-blue-200 hover:bg-blue-50 focus:ring-4 focus:ring-blue-100 rounded-xl font-bold transition-all gap-2"
                                            >
                                                <Edit2 className="w-4 h-4" /> Edit Details
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleDeleteClick(pricing.id)}
                                            className="h-12 px-5 text-red-600 border-red-200 hover:bg-red-50 focus:ring-4 focus:ring-red-100 rounded-xl font-bold transition-all shrink-0"
                                            title="Delete Pricing"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {metadata && metadata.total_page > 0 && (
                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        className="cursor-pointer font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl px-4"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    />
                                </PaginationItem>

                                {Array.from({ length: metadata.total_page }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            className={`cursor-pointer w-10 h-10 rounded-xl font-bold ${currentPage === page
                                                ? "bg-primary text-white hover:bg-primary/90"
                                                : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                            isActive={currentPage === page}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        className="cursor-pointer font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl px-4"
                                        onClick={() => setCurrentPage((p) => Math.min(metadata.total_page, p + 1))}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={confirmDelete}
                title="Delete Pricing Option"
                description="Are you sure you want to delete this pricing option? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}
