"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Search, Edit2, Trash2, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
    useGetHealthCheckupPackagesQuery,
    useDeleteHealthCheckupPackageMutation,
    useUpdateHealthCheckupPackageMutation,
} from "@/services/healthCheckupPackageApi";
import toast from "react-hot-toast";

export default function HealthCheckupPackagesPage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState<number | null>(null);

    const { data, isLoading } = useGetHealthCheckupPackagesQuery(currentPage);
    const [deletePackage] = useDeleteHealthCheckupPackageMutation();
    const [updatePackage] = useUpdateHealthCheckupPackageMutation();

    const metadata = data?.pagination;

    const handleDeleteClick = (id: number) => {
        setPackageToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!packageToDelete) return;

        try {
            await deletePackage(packageToDelete).unwrap();
            toast.success("Package deleted successfully");
        } catch (error) {
            toast.error("Failed to delete package");
        } finally {
            setDeleteConfirmOpen(false);
            setPackageToDelete(null);
        }
    };

    const handleStatusToggle = async (pkg: any) => {
        const newStatus = pkg.status === "active" ? "inactive" : "active";
        try {
            await updatePackage({
                id: pkg.id,
                data: { status: newStatus },
            }).unwrap();
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    // Filter local data just to provide some search feature on the current page
    const filteredPackages = data?.data.filter((pkg) =>
        pkg.package_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Checkup Packages</h1>
                    <p className="text-gray-500">Manage all available health checkup packages</p>
                </div>
                <Link to="/admin/health-checkup-packages/new">
                    <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl font-bold px-6 py-6 shadow-xl shadow-primary/20 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Package
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search packages by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                        <p className="text-gray-400 font-medium">Loading packages...</p>
                    </div>
                ) : filteredPackages?.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                            <Package className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No Packages Found</h3>
                        <p className="text-gray-500 max-w-sm">
                            You haven't added any packages yet, or none match your search criteria.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <Table>
                            <TableHeader className="bg-gray-50/80">
                                <TableRow>
                                    <TableHead className="font-bold py-5 w-[100px]">Image</TableHead>
                                    <TableHead className="font-bold py-5">Package Name</TableHead>
                                    <TableHead className="font-bold py-5">Status</TableHead>
                                    <TableHead className="text-right font-bold py-5">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPackages?.map((pkg) => (
                                    <TableRow key={pkg.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <TableCell className="py-4">
                                            {pkg.image ? (
                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                                                    <img
                                                        src={pkg.image}
                                                        alt={pkg.package_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-gray-300" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-gray-900 text-lg">
                                                {pkg.package_name}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <button onClick={() => handleStatusToggle(pkg)} className="focus:outline-none">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        pkg.status === "active"
                                                            ? "bg-green-50 text-green-700 border-green-200 font-bold px-3 py-1 hover:bg-green-100 transition-colors cursor-pointer"
                                                            : "bg-red-50 text-red-700 border-red-200 font-bold px-3 py-1 hover:bg-red-100 transition-colors cursor-pointer"
                                                    }
                                                >
                                                    <div
                                                        className={`w-1.5 h-1.5 rounded-full mr-2 ${pkg.status === "active" ? "bg-green-500" : "bg-red-500"
                                                            }`}
                                                    />
                                                    {pkg.status.toUpperCase()}
                                                </Badge>
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/admin/health-checkup-packages/edit/${pkg.id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 bg-gray-50 rounded-xl"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(pkg.id)}
                                                    className="h-10 w-10 text-gray-400 hover:text-red-600 hover:bg-red-50 bg-gray-50 rounded-xl"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Pagination */}
                {metadata && metadata.total_page > 1 && (
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
                title="Delete Package"
                description="Are you sure you want to delete this package? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}
