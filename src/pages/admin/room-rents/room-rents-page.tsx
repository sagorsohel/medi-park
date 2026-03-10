"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Edit2, Trash2, PlusCircle, X, Search, BedDouble } from "lucide-react";
import toast from "react-hot-toast";
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
    useGetRoomRentsQuery,
    useCreateRoomRentsMutation,
    useUpdateRoomRentMutation,
    useDeleteRoomRentMutation,
} from "@/services/roomRentApi";

export default function RoomRentsManagePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: roomRentsData, isLoading } = useGetRoomRentsQuery(currentPage);
    const [createRoomRents] = useCreateRoomRentsMutation();
    const [updateRoomRent] = useUpdateRoomRentMutation();
    const [deleteRoomRent] = useDeleteRoomRentMutation();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const metadata = roomRentsData?.pagination;

    // For Add (Multiple rows)
    const [addForm, setAddForm] = useState({
        room_rents: [{ bed_name: "", charges: "", status: "active" }]
    });

    // For Edit (Single row)
    const [editForm, setEditForm] = useState({
        bed_name: "",
        charges: "",
        status: "active"
    });

    const handleAddRow = () => {
        setAddForm(prev => ({
            ...prev,
            room_rents: [...prev.room_rents, { bed_name: "", charges: "", status: "active" }]
        }));
    };

    const handleRemoveRow = (index: number) => {
        setAddForm(prev => ({
            ...prev,
            room_rents: prev.room_rents.filter((_, i) => i !== index)
        }));
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check empty rows
        const validRows = addForm.room_rents.filter(r => r.bed_name.trim() !== "" && r.charges !== "");
        if (validRows.length === 0) {
            toast.error("Please add at least one valid room rent entry.");
            return;
        }

        try {
            await createRoomRents({
                room_rents: validRows.map(r => ({
                    ...r,
                    charges: r.charges.toString()
                }))
            }).unwrap();

            toast.success("Room Rents added successfully");
            setIsAddOpen(false);
            setAddForm({ room_rents: [{ bed_name: "", charges: "", status: "active" }] });
            setCurrentPage(1); // Go to first page to see new entries usually
        } catch (error: any) {
            if (error?.data?.message) {
                toast.error(error.data.message);
            } else {
                toast.error("Failed to add room rents");
            }
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateRoomRent({
                id: selectedItem.id,
                data: {
                    bed_name: editForm.bed_name,
                    charges: editForm.charges.toString(),
                    status: editForm.status
                }
            }).unwrap();
            toast.success("Room Rent updated successfully");
            setIsEditOpen(false);
        } catch (error: any) {
            if (error?.data?.message) {
                toast.error(error.data.message);
            } else {
                toast.error("Failed to update room rent");
            }
        }
    };

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            await deleteRoomRent(itemToDelete).unwrap();
            toast.success("Deleted successfully");
        } catch (error) {
            toast.error("Failed to delete room rent");
        } finally {
            setDeleteConfirmOpen(false);
            setItemToDelete(null);
        }
    };

    const handleStatusToggle = async (item: any) => {
        const newStatus = item.status === "active" ? "inactive" : "active";
        try {
            await updateRoomRent({
                id: item.id,
                data: { status: newStatus },
            }).unwrap();
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredData = roomRentsData?.data.filter(item =>
        item.bed_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Rents</h1>
                    <p className="text-gray-500">Manage hospital beds and room charges</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl font-bold px-6 py-6 shadow-xl shadow-primary/20 flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add Room / Bed
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl p-8 max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Bulk Add Room & Beds</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-8 pt-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b">
                                    <Label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Room Entries</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleAddRow}
                                        className="h-8 text-primary font-bold hover:bg-primary/5 rounded-lg flex items-center gap-1.5"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Another Line
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {addForm.room_rents.map((row, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-4 items-end animate-in fade-in slide-in-from-top-2">
                                            <div className="col-span-5 space-y-1.5">
                                                <Label className="text-xs font-bold text-gray-400 ml-1">Bed/Room Name *</Label>
                                                <Input
                                                    placeholder="e.g. VIP Cabin"
                                                    value={row.bed_name}
                                                    onChange={e => {
                                                        const newRows = [...addForm.room_rents];
                                                        newRows[idx].bed_name = e.target.value;
                                                        setAddForm({ ...addForm, room_rents: newRows });
                                                    }}
                                                    className="h-12 rounded-xl bg-gray-50/30 font-medium"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-3 space-y-1.5">
                                                <Label className="text-xs font-bold text-gray-400 ml-1">Charges *</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 1500"
                                                    value={row.charges}
                                                    onChange={e => {
                                                        const newRows = [...addForm.room_rents];
                                                        newRows[idx].charges = e.target.value;
                                                        setAddForm({ ...addForm, room_rents: newRows });
                                                    }}
                                                    className="h-12 rounded-xl bg-gray-50/30 font-medium"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-3 space-y-1.5">
                                                <Label className="text-xs font-bold text-gray-400 ml-1">Status</Label>
                                                <Select
                                                    value={row.status}
                                                    onValueChange={v => {
                                                        const newRows = [...addForm.room_rents];
                                                        newRows[idx].status = v;
                                                        setAddForm({ ...addForm, room_rents: newRows });
                                                    }}
                                                >
                                                    <SelectTrigger className="h-12 rounded-xl bg-gray-50/30 font-medium">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-1 pb-1.5">
                                                {addForm.room_rents.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveRow(idx)}
                                                        className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <DialogFooter className="pt-6 border-t gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsAddOpen(false)}
                                    className="px-6 h-14 rounded-2xl font-bold text-gray-500 hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 bg-primary h-14 rounded-2xl font-bold shadow-lg shadow-primary/20">
                                    Save Records
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search by bed or room name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                        <p className="text-gray-400 font-medium tracking-tight">Loading room rents...</p>
                    </div>
                ) : filteredData?.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                            <BedDouble className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No Room Rents Found</h3>
                        <p className="text-gray-500 max-w-sm">
                            No records match your view right now. Add a new bed or adjust your search to find what you need.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <Table>
                            <TableHeader className="bg-gray-50/80">
                                <TableRow>
                                    <TableHead className="font-bold py-5">Bed/Room Name</TableHead>
                                    <TableHead className="font-bold py-5">Charges (৳)</TableHead>
                                    <TableHead className="font-bold py-5">Status</TableHead>
                                    <TableHead className="text-right font-bold py-5 border-0">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData?.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <TableCell className="font-bold text-gray-900 py-4 text-lg">
                                            {item.bed_name}
                                        </TableCell>
                                        <TableCell className="font-semibold text-gray-600 py-4 text-md">
                                            {item.charges}
                                        </TableCell>
                                        <TableCell className="py-4 border-0">
                                            <button onClick={() => handleStatusToggle(item)} className="focus:outline-none">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        item.status === "active"
                                                            ? "bg-green-50 text-green-700 border-green-200 font-bold px-3 py-1 hover:bg-green-100 transition-colors cursor-pointer"
                                                            : "bg-red-50 text-red-700 border-red-200 font-bold px-3 py-1 hover:bg-red-100 transition-colors cursor-pointer"
                                                    }
                                                >
                                                    <div
                                                        className={`w-1.5 h-1.5 rounded-full mr-2 ${item.status === "active" ? "bg-green-500" : "bg-red-500"
                                                            }`}
                                                    />
                                                    {item.status.toUpperCase()}
                                                </Badge>
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-right py-4 border-0">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 bg-gray-50 rounded-xl"
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setEditForm({
                                                            bed_name: item.bed_name,
                                                            charges: item.charges.toString(),
                                                            status: item.status
                                                        });
                                                        setIsEditOpen(true);
                                                    }}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 text-gray-400 hover:text-red-600 hover:bg-red-50 bg-gray-50 rounded-xl"
                                                    onClick={() => handleDeleteClick(item.id)}
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

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="rounded-3xl p-8 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Edit Room Rent</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold">Bed Name</Label>
                            <Input
                                value={editForm.bed_name}
                                onChange={e => setEditForm({ ...editForm, bed_name: e.target.value })}
                                className="h-12 rounded-xl"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold">Charges</Label>
                            <Input
                                type="number"
                                value={editForm.charges}
                                onChange={e => setEditForm({ ...editForm, charges: e.target.value })}
                                className="h-12 rounded-xl"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold">Status</Label>
                            <Select
                                value={editForm.status}
                                onValueChange={v => setEditForm({ ...editForm, status: v })}
                            >
                                <SelectTrigger className="h-12 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="px-6 h-12 rounded-xl font-bold text-gray-500">Cancel</Button>
                            <Button type="submit" className="w-full bg-primary h-12 rounded-xl font-bold shadow-lg shadow-primary/20">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={confirmDelete}
                title="Delete Entry"
                description="Are you sure you want to delete this room rent? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}
