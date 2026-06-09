"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Search, Edit2, Trash2, Loader2, FileText, Calendar, Eye } from "lucide-react";
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
  useGetNoticesQuery,
  useDeleteNoticeMutation,
} from "@/services/noticeApi";
import toast from "react-hot-toast";

export default function NoticesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch } = useGetNoticesQuery(currentPage);
  const [deleteNotice] = useDeleteNoticeMutation();

  const metadata = data?.pagination;
  const records = data?.data ?? [];

  const handleDeleteClick = (id: number) => {
    setNoticeToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!noticeToDelete) return;

    try {
      await deleteNotice(noticeToDelete).unwrap();
      toast.success("Notice deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete notice");
    } finally {
      setDeleteConfirmOpen(false);
      setNoticeToDelete(null);
    }
  };

  const filteredData = records.filter((rec) =>
    rec.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notice Board</h1>
          <p className="text-gray-500">Manage notices published to the public notice board.</p>
        </div>
        <Link to="/admin/notices/new">
          <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl font-bold px-6 py-6 shadow-xl shadow-primary/20 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Notice
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
            <p className="text-gray-400 font-medium">Loading notices...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <FileText className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Notices Found</h3>
            <p className="text-gray-500 max-w-sm">
              You haven't added any notices yet, or none match your search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <Table>
              <TableHeader className="bg-gray-50/80">
                <TableRow>
                  <TableHead className="font-bold py-5">Title</TableHead>
                  <TableHead className="font-bold py-5">Published Date</TableHead>
                  <TableHead className="text-right font-bold py-5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((rec) => (
                  <TableRow key={rec.id} className="hover:bg-gray-50/50 transition-colors group">
                    <TableCell>
                      <span className="font-bold text-gray-900 text-lg">
                        {rec.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {rec.published_at
                          ? new Date(rec.published_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Draft / Not Scheduled"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/notices/view/${rec.id}`)}
                          className="h-10 w-10 text-gray-400 hover:text-gray-600 hover:bg-gray-100 bg-gray-50 rounded-xl"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/notices/edit/${rec.id}`)}
                          className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 bg-gray-50 rounded-xl"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(rec.id)}
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
                      className={`cursor-pointer w-10 h-10 rounded-xl font-bold ${
                        currentPage === page
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
        title="Delete Notice"
        description="Are you sure you want to delete this notice? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
