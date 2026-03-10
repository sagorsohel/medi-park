"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
    useGetEquipmentCategoriesQuery,
    useCreateEquipmentCategoryMutation,
    useUpdateEquipmentCategoryMutation,
    useDeleteEquipmentCategoryMutation,
    useGetEquipmentsQuery,
    useCreateEquipmentMutation,
    useUpdateEquipmentMutation,
    useDeleteEquipmentMutation,
} from "@/services/equipmentApi";
import { Loader2, Plus, Edit2, Trash2, PlusCircle, X } from "lucide-react";
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

export default function EquipmentManagePage() {
    const [activeTab, setActiveTab] = useState("categories");

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Equipment Management</h1>
                <p className="text-gray-500">Manage categories and detailed equipment items</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white p-1 h-auto border shadow-sm rounded-xl">
                    <TabsTrigger
                        value="categories"
                        className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-semibold"
                    >
                        Categories
                    </TabsTrigger>
                    <TabsTrigger
                        value="items"
                        className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-semibold"
                    >
                        Equipment Items
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <CategoriesTab />
                </TabsContent>

                <TabsContent value="items" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ItemsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function CategoriesTab() {
    const { data, isLoading } = useGetEquipmentCategoriesQuery();
    const [createCategory] = useCreateEquipmentCategoryMutation();
    const [updateCategory] = useUpdateEquipmentCategoryMutation();
    const [deleteCategory] = useDeleteEquipmentCategoryMutation();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", status: "active" });

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCategory(formData).unwrap();
            toast.success("Category created successfully");
            setIsAddOpen(false);
            setFormData({ name: "", status: "active" });
        } catch (error) {
            toast.error("Failed to create category");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateCategory({ id: selectedCategory.id, data: formData }).unwrap();
            toast.success("Category updated successfully");
            setIsEditOpen(false);
        } catch (error) {
            toast.error("Failed to update category");
        }
    };

    const handleDeleteClick = (id: number) => {
        setCategoryToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(categoryToDelete).unwrap();
            toast.success("Category deleted successfully");
        } catch (error) {
            toast.error("Failed to delete category");
        } finally {
            setDeleteConfirmOpen(false);
            setCategoryToDelete(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">All Categories</h3>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl font-bold flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl p-8 max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Add New Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold ml-1">Category Name</Label>
                                <Input
                                    placeholder="e.g. Diagnostic Equipment"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold ml-1">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={v => setFormData({ ...formData, status: v })}
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
                                <Button type="submit" className="w-full bg-primary h-12 rounded-xl font-bold">Create Category</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                    <p className="text-gray-400 font-medium tracking-tight">Loading categories...</p>
                </div>
            ) : (
                <div className="border rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="font-bold py-4">Name</TableHead>
                                <TableHead className="font-bold py-4">Status</TableHead>
                                <TableHead className="text-right font-bold py-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.data.map((cat) => (
                                <TableRow key={cat.id} className="hover:bg-gray-50/30 transition-colors">
                                    <TableCell className="font-medium py-4">{cat.name}</TableCell>
                                    <TableCell className="py-4">
                                        <Badge variant="outline" className={cat.status === "active" ? "bg-green-50 text-green-700 border-green-100 font-bold px-3 py-1" : "bg-gray-50 text-gray-500 border-gray-100 font-bold px-3 py-1"}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${cat.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                                            {cat.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setFormData({ name: cat.name, status: cat.status });
                                                    setIsEditOpen(true);
                                                }}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-600"
                                                onClick={() => handleDeleteClick(cat.id)}
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

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="rounded-3xl p-8 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Edit Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold ml-1">Category Name</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="h-12 rounded-xl"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold ml-1">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={v => setFormData({ ...formData, status: v })}
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
                            <Button type="submit" className="w-full bg-primary h-12 rounded-xl font-bold">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={confirmDelete}
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}

function ItemsTab() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: categories } = useGetEquipmentCategoriesQuery();
    const { data: equipments, isLoading } = useGetEquipmentsQuery(currentPage);
    const [createEquipment] = useCreateEquipmentMutation();
    const [updateEquipment] = useUpdateEquipmentMutation();
    const [deleteEquipment] = useDeleteEquipmentMutation();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const metadata = equipments?.pagination;

    // For Add (one category, Multiple names)
    const [addForm, setAddForm] = useState({
        equipment_category_id: "",
        equipment: [{ name: "", status: "active" }]
    });

    // For Edit (single)
    const [editForm, setEditForm] = useState({
        equipment_category_id: "",
        name: "",
        status: "active"
    });

    const handleAddRow = () => {
        setAddForm(prev => ({
            ...prev,
            equipment: [...prev.equipment, { name: "", status: "active" }]
        }));
    };

    const handleRemoveRow = (index: number) => {
        setAddForm(prev => ({
            ...prev,
            equipment: prev.equipment.filter((_, i) => i !== index)
        }));
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.equipment_category_id) {
            toast.error("Please select a category");
            return;
        }
        try {
            await createEquipment({
                equipment_category_id: parseInt(addForm.equipment_category_id),
                equipment: addForm.equipment.filter(e => e.name.trim() !== "")
            }).unwrap();
            toast.success("Equipment items added successfully");
            setIsAddOpen(false);
            setAddForm({ equipment_category_id: "", equipment: [{ name: "", status: "active" }] });
        } catch (error) {
            toast.error("Failed to add items");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateEquipment({
                id: selectedItem.id,
                data: {
                    equipment_category_id: parseInt(editForm.equipment_category_id),
                    name: editForm.name,
                    status: editForm.status
                }
            }).unwrap();
            toast.success("Item updated successfully");
            setIsEditOpen(false);
        } catch (error) {
            toast.error("Failed to update item");
        }
    };

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            await deleteEquipment(itemToDelete).unwrap();
            toast.success("Deleted successfully");
        } catch (error) {
            toast.error("Failed to delete");
        } finally {
            setDeleteConfirmOpen(false);
            setItemToDelete(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Equipment Items</h3>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl font-bold flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add Equipment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl p-8 max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Bulk Add Equipment Items</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-8 pt-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold ml-1 text-gray-700">Select Category *</Label>
                                <Select
                                    value={addForm.equipment_category_id}
                                    onValueChange={v => setAddForm({ ...addForm, equipment_category_id: v })}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 shadow-sm transition-all focus:bg-white text-lg font-medium">
                                        <SelectValue placeholder="Choose a category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                                        {categories?.data.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()} className="py-3 rounded-xl font-medium">
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b">
                                    <Label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Equipment Details</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleAddRow}
                                        className="h-8 text-primary font-bold hover:bg-primary/5 rounded-lg flex items-center gap-1.5"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Another
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {addForm.equipment.map((row, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-4 items-end animate-in fade-in slide-in-from-top-2">
                                            <div className="col-span-7 space-y-1.5">
                                                <Label className="text-xs font-bold text-gray-400 ml-1">Item Name</Label>
                                                <Input
                                                    placeholder="e.g. MRI Machine"
                                                    value={row.name}
                                                    onChange={e => {
                                                        const newEquip = [...addForm.equipment];
                                                        newEquip[idx].name = e.target.value;
                                                        setAddForm({ ...addForm, equipment: newEquip });
                                                    }}
                                                    className="h-12 rounded-xl bg-gray-50/30 font-medium"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-4 space-y-1.5">
                                                <Label className="text-xs font-bold text-gray-400 ml-1">Status</Label>
                                                <Select
                                                    value={row.status}
                                                    onValueChange={v => {
                                                        const newEquip = [...addForm.equipment];
                                                        newEquip[idx].status = v;
                                                        setAddForm({ ...addForm, equipment: newEquip });
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
                                                {addForm.equipment.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveRow(idx)}
                                                        className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
                                    className="px-6 h-14 rounded-2xl font-bold text-gray-500"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 bg-primary h-14 rounded-2xl font-bold shadow-lg shadow-primary/20">
                                    Add to Category
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                    <p className="text-gray-400 font-medium tracking-tight">Loading items...</p>
                </div>
            ) : (
                <div className="border rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="font-bold py-4">Item Name</TableHead>
                                <TableHead className="font-bold py-4">Category</TableHead>
                                <TableHead className="font-bold py-4">Status</TableHead>
                                <TableHead className="text-right font-bold py-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {equipments?.data.map((item) => {
                                const categoryName = item.equipment_category?.name || categories?.data.find(c => c.id === item.equipment_category_id)?.name;
                                return (
                                    <TableRow key={item.id} className="hover:bg-gray-50/30">
                                        <TableCell className="font-semibold py-4 text-gray-900">{item.name}</TableCell>
                                        <TableCell className="py-4 font-medium text-gray-500">{categoryName || "N/A"}</TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant="outline" className={item.status === "active" ? "bg-green-50 text-green-700 border-green-100 font-bold px-3 py-1" : "bg-gray-50 text-gray-500 border-gray-100 font-bold px-3 py-1"}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${item.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                                                {item.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-lg hover:bg-blue-50"
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setEditForm({
                                                            equipment_category_id: item.equipment_category_id.toString(),
                                                            name: item.name,
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
                                                    className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-600"
                                                    onClick={() => handleDeleteClick(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Pagination */}
            {metadata && metadata.total_page > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-6">
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

            {/* Edit Item Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="rounded-3xl p-8 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Edit Equipment Item</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold">Category</Label>
                            <Select
                                value={editForm.equipment_category_id}
                                onValueChange={v => setEditForm({ ...editForm, equipment_category_id: v })}
                            >
                                <SelectTrigger className="h-12 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {categories?.data.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold">Item Name</Label>
                            <Input
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
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
                            <Button type="submit" className="w-full bg-primary h-12 rounded-xl font-bold">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={confirmDelete}
                title="Delete Equipment"
                description="Are you sure you want to delete this equipment item? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}
