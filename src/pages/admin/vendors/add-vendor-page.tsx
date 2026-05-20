"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Loader2,
  Trash2,
  Upload,
  Building,
  Mail,
  Phone,
  MapPin,
  Tag,
  X,
  FileImage,
} from "lucide-react";
import {
  useGetVendorQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
} from "@/services/vendorApi";
import toast from "react-hot-toast";

export default function AddVendorPage() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const vendorId = params.id ? parseInt(params.id) : null;

  const pathname = window.location.pathname;
  const isViewMode = pathname.includes("/view/");
  const isEditMode = pathname.includes("/edit/");
  const isCreateMode = !vendorId && !isEditMode && !isViewMode;

  const { data: vendorData, isLoading } = useGetVendorQuery(vendorId!, { skip: !vendorId });
  const [createVendor, { isLoading: isCreating }] = useCreateVendorMutation();
  const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [materials, setMaterials] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // File State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load existing vendor data
  useEffect(() => {
    if (vendorData?.data) {
      const vendor = vendorData.data;
      setCompanyName(vendor.company_name || "");
      setCompanyEmail(vendor.company_email || "");
      setCompanyPhone(vendor.company_phone || "");
      setCompanyAddress(vendor.company_address || "");
      setStatus(vendor.status || "active");
      setMaterials(vendor.supply_materials || []);
      setImagePreview(vendor.company_image || null);
    }
  }, [vendorData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (value && !materials.includes(value)) {
      setMaterials([...materials, value]);
    }
    setTagInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!companyName) {
      toast.error("Company name is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("company_name", companyName);
      formData.append("status", status);
      if (companyEmail) formData.append("company_email", companyEmail);
      if (companyPhone) formData.append("company_phone", companyPhone);
      if (companyAddress) formData.append("company_address", companyAddress);
      
      // Append supply materials array
      materials.forEach((mat) => {
        formData.append("supply_materials[]", mat);
      });

      if (imageFile) {
        formData.append("company_image", imageFile);
      }

      if (isEditMode && vendorId) {
        // Standard Laravel PUT override via POST multipart format:
        formData.append("_method", "PUT");
        await updateVendor({ id: vendorId, formData }).unwrap();
        toast.success("Vendor profile updated successfully!");
      } else {
        await createVendor(formData).unwrap();
        toast.success("Vendor profile created successfully!");
      }

      navigate("/accounting/software/vendors");
    } catch (err: any) {
      console.error("Failed to save vendor:", err);
      const msg = err?.data?.message || "Failed to save vendor. Please check entries.";
      toast.error(msg);
    }
  };

  if (isLoading && vendorId) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B1B3D]" />
      </div>
    );
  }

  const readOnlyProps = isViewMode ? { readOnly: true, disabled: true } : {};

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
            {isCreateMode && "Register Vendor Partner"}
            {isEditMode && "Edit Vendor Details"}
            {isViewMode && "View Vendor Profile"}
          </h1>
          <p className="text-xs text-gray-500">
            {isCreateMode && "Enter new vendor profiles and specify materials supplied."}
            {isEditMode && "Update fields or replace uploaded company logos/images."}
            {isViewMode && "Review uploaded details and supply materials mappings."}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* Basic info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label htmlFor="companyName" className="font-bold text-gray-700">Company / Vendor Name *</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corp, Steel Supply Ltd."
                className="pl-10"
                required
                {...readOnlyProps}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="companyEmail" className="font-bold text-gray-700">Company Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="companyEmail"
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="contact@acme.com"
                className="pl-10"
                {...readOnlyProps}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="companyPhone" className="font-bold text-gray-700">Company Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="companyPhone"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="+1-555-0199"
                className="pl-10"
                {...readOnlyProps}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="companyAddress" className="font-bold text-gray-700">Office / Delivery Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Textarea
              id="companyAddress"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="e.g. 123 Acme Way, City Center"
              rows={3}
              className="pl-10"
              {...readOnlyProps}
            />
          </div>
        </div>

        {/* Supply Materials Tag Input */}
        <div className="space-y-3">
          <Label htmlFor="tagInput" className="font-bold text-gray-700">Supply Materials</Label>
          
          {!isViewMode && (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="tagInput"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type material name (e.g. Steel, Copper) and press Enter"
                  className="pl-10"
                />
              </div>
              <Button type="button" onClick={handleAddTag}>Add</Button>
            </div>
          )}

          {/* Tags preview */}
          {materials.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
              {materials.map((mat, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-blue-700 border border-blue-100 shadow-sm"
                >
                  {mat}
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(i)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-400 italic">No supply materials specified yet.</div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="status" className="font-bold text-gray-700">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            disabled={isViewMode}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Logo / Company Image */}
        <div className="space-y-3">
          <Label className="font-bold text-gray-700">Company Image / Logo</Label>
          
          {!isViewMode && (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                <p className="text-sm font-semibold">Click to upload image or drag and drop</p>
                <p className="text-xs text-gray-400">Supported formats: JPEG, PNG, GIF (Max 5MB)</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {imagePreview && (
            <div className="relative w-36 h-36 rounded-lg overflow-hidden border border-gray-200 shadow-sm mx-auto">
              <img src={imagePreview} alt="Company preview" className="w-full h-full object-cover" />
              {!isViewMode && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {!imagePreview && (
            <div className="text-gray-400 text-xs py-2 flex items-center gap-1.5 justify-center border border-gray-50 rounded-xl bg-gray-50/50">
              <FileImage className="w-4 h-4" /> No company image selected
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/accounting/software/vendors")}
          >
            {isViewMode ? "Go Back" : "Cancel"}
          </Button>
          {!isViewMode && (
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-[#0B1B3D] hover:bg-[#0B1B3D]/95 text-white flex items-center gap-2 min-w-[120px]"
            >
              {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditMode ? "Update Vendor" : "Register Vendor"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
