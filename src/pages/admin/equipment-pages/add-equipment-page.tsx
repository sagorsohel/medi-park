"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChevronLeft,
  Loader2,
  Calendar,
  DollarSign,
  Layers,
  Truck,
  Hash,
  ShieldCheck,
  Clipboard,
  FileText,
  Save,
} from "lucide-react";
import {
  useGetEquipmentPageQuery,
  useCreateEquipmentPageMutation,
  useUpdateEquipmentPageMutation,
} from "@/services/equipmentPageApi";
import { useGetEquipmentsPublicQuery } from "@/services/equipmentApi";
import { useGetVendorsQuery } from "@/services/vendorApi";
import toast from "react-hot-toast";

export default function AddEquipmentPagePage() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const id = params.id ? parseInt(params.id) : null;

  const pathname = window.location.pathname;
  const isViewMode = pathname.includes("/view/");
  const isEditMode = pathname.includes("/edit/");
  const isCreateMode = !id && !isEditMode && !isViewMode;

  const { data: recordData, isLoading: isRecordLoading } = useGetEquipmentPageQuery(id!, { skip: !id });
  const { data: equipmentsData, isLoading: isEquipmentsLoading } = useGetEquipmentsPublicQuery();
  const { data: vendorsData, isLoading: isVendorsLoading } = useGetVendorsQuery({ limit: 1000 });

  const [createRecord, { isLoading: isCreating }] = useCreateEquipmentPageMutation();
  const [updateRecord, { isLoading: isUpdating }] = useUpdateEquipmentPageMutation();

  // Form State
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [purchaseNo, setPurchaseNo] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Load existing purchase details when editing or viewing
  useEffect(() => {
    if (recordData?.data) {
      const rec = recordData.data;
      setTitle(rec.title || "");
      setStatus(rec.status || "active");
      setPurchaseNo(rec.purchase_no || "");
      setEquipmentId(rec.equipment_id ? rec.equipment_id.toString() : "");
      setVendorId(rec.vendor_id ? rec.vendor_id.toString() : "");
      setPurchaseDate(rec.purchase_date || "");
      setQuantity(rec.quantity ?? "");
      setUnitPrice(rec.unit_price ?? "");
      setWarrantyExpiryDate(rec.warranty_expiry_date || "");
      setSerialNumber(rec.serial_number || "");
      setNotes(rec.notes || "");
    }
  }, [recordData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!purchaseNo.trim()) {
      toast.error("Purchase number is required.");
      return;
    }
    if (!vendorId) {
      toast.error("Please select a vendor.");
      return;
    }
    if (!purchaseDate) {
      toast.error("Purchase date is required.");
      return;
    }
    if (quantity === "" || quantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }
    if (unitPrice === "" || unitPrice < 0) {
      toast.error("Unit price cannot be negative.");
      return;
    }


    const payload = {
      title,
      status,
      purchase_no: purchaseNo,
      equipment_id: equipmentId ? parseInt(equipmentId) : null,
      vendor_id: parseInt(vendorId),
      purchase_date: purchaseDate,
      quantity: Number(quantity),
      unit_price: Number(unitPrice),
      warranty_expiry_date: warrantyExpiryDate || null,
      serial_number: serialNumber || null,
      notes: notes || null,
    };

    try {
      if (isEditMode && id) {
        await updateRecord({ id, data: payload }).unwrap();
        toast.success("Equipment page updated successfully!");
      } else {
        await createRecord(payload).unwrap();
        toast.success("Equipment page created successfully!");
      }
      navigate("/accounting/software/equipment-pages");
    } catch (err) {
      console.error("Failed to save purchase details:", err);
      const typedErr = err as { data?: { message?: string } };
      const msg = typedErr?.data?.message || "Failed to save purchase details. Please check the inputs.";
      toast.error(msg);
    }
  };

  const equipments = equipmentsData?.data ?? [];
  const vendors = vendorsData?.data ?? [];

  if ((isRecordLoading && id) || isEquipmentsLoading || isVendorsLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B1B3D]" />
        <p className="text-sm text-gray-500 font-medium">Loading form options...</p>
      </div>
    );
  }

  const readOnlyProps = isViewMode ? { readOnly: true, disabled: true } : {};
  const totalCost = (Number(quantity) || 0) * (Number(unitPrice) || 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl space-y-6">
      {/* Back & Title */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8 -ml-2 text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B1B3D]">
            {isCreateMode && "Add New Equipment Page"}
            {isEditMode && "Edit Equipment Page Details"}
            {isViewMode && "View Equipment Page Record"}
          </h1>
          <p className="text-xs text-gray-500">
            {isCreateMode && "Configure and register a new equipment page & purchase details."}
            {isEditMode && "Update details of the registered equipment page."}
            {isViewMode && "Review equipment page specifications, invoice cost, and warranty details."}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* Row: Title & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-bold text-gray-700">Title / Page Name *</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Diagnostic Ultrasound Scanner Page"
                className="pl-10"
                required
                {...readOnlyProps}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="font-bold text-gray-700">Status *</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as "active" | "inactive")}
              disabled={isViewMode}
            >
              <SelectTrigger className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                <SelectItem value="active" className="py-2.5 rounded-lg focus:bg-primary/5 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-semibold text-green-700">Active</span>
                  </div>
                </SelectItem>
                <SelectItem value="inactive" className="py-2.5 rounded-lg focus:bg-red-50/50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="font-semibold text-red-700">Inactive</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row: Purchase No & Vendor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="purchaseNo" className="font-bold text-gray-700">Purchase Number *</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="purchaseNo"
                value={purchaseNo}
                onChange={(e) => setPurchaseNo(e.target.value)}
                placeholder="e.g. EP-2026-0001"
                className="pl-10"
                required
                {...readOnlyProps}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendorId" className="font-bold text-gray-700">Vendor *</Label>
            <div className="relative">
              <Truck className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
              <select
                id="vendorId"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring h-10"
                required
                disabled={isViewMode}
              >
                <option value="">Choose Vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id.toString()}>
                    {v.company_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row: Equipment & Purchase Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="equipmentId" className="font-bold text-gray-700">Equipment Item (Optional)</Label>
            <div className="relative">
              <Layers className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
              <select
                id="equipmentId"
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring h-10"
                disabled={isViewMode}
              >
                <option value="">Choose Equipment</option>
                {equipments.map((eq) => (
                  <option key={eq.id} value={eq.id.toString()}>
                    {eq.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate" className="font-bold text-gray-700">Purchase Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="pl-10"
                required
                {...readOnlyProps}
              />
            </div>
          </div>
        </div>

        {/* Row: Quantity & Unit Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="font-bold text-gray-700">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 5"
              required
              {...readOnlyProps}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitPrice" className="font-bold text-gray-700">Unit Price ($) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="unitPrice"
                type="number"
                min={0}
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 1500"
                className="pl-10"
                required
                {...readOnlyProps}
              />
            </div>
          </div>
        </div>

        {/* Live Calculation Preview */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600">Calculated Total Cost:</span>
          <span className="text-xl font-bold text-[#0B1B3D]">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        {/* Row: Warranty Expiry & Serial Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="warrantyExpiryDate" className="font-bold text-gray-700">Warranty Expiry Date</Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="warrantyExpiryDate"
                type="date"
                value={warrantyExpiryDate}
                onChange={(e) => setWarrantyExpiryDate(e.target.value)}
                className="pl-10"
                {...readOnlyProps}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber" className="font-bold text-gray-700">Serial Number / Asset Tag</Label>
            <div className="relative">
              <Clipboard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. SN-98765-ABC"
                className="pl-10"
                {...readOnlyProps}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="font-bold text-gray-700">Notes / Internal Remarks</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional procurement details or warranty coverage information..."
            rows={4}
            {...readOnlyProps}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/accounting/software/equipment-pages")}
          >
            {isViewMode ? "Go Back" : "Cancel"}
          </Button>
          {!isViewMode && (
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-[#0B1B3D] hover:bg-[#0B1B3D]/95 text-white shadow-lg shadow-primary/20 transition-all flex items-center gap-2 min-w-[120px]"
            >
              {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              <Save className="w-4 h-4 mr-1" />
              {isEditMode ? "Save Changes" : "Create Page"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
