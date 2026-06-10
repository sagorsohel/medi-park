"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Trash2,
  Pencil,
  Calendar,
  User,
  Phone,
  Heart,
  Camera,
  Loader2,
  Shield,
} from "lucide-react";
import {
  useGetInvestorFamilyMembersQuery,
  useCreateInvestorFamilyMemberMutation,
  useUpdateInvestorFamilyMemberMutation,
  useDeleteInvestorFamilyMemberMutation,
  useGetInvestorByIdQuery,
  useUpdateParentStatusMutation,
  type InvestorFamilyMember,
} from "@/services/investorApi";
import toast from "react-hot-toast";

interface InvestorFamilyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investorId: number;
  investorName: string;
}

export function InvestorFamilyModal({
  open,
  onOpenChange,
  investorId,
  investorName,
}: InvestorFamilyModalProps) {
  // Queries & Mutations
  const { data: familyData, isLoading, refetch } = useGetInvestorFamilyMembersQuery(investorId, {
    skip: !open || !investorId,
  });

  const { data: investorData, refetch: refetchInvestor } = useGetInvestorByIdQuery(investorId, {
    skip: !open || !investorId,
  });
  const [updateParentStatus, { isLoading: isUpdatingParent }] = useUpdateParentStatusMutation();

  const investorInfo = investorData?.data;
  const [localFatherAlive, setLocalFatherAlive] = useState(true);
  const [localMotherAlive, setLocalMotherAlive] = useState(true);

  // Safe parent alive status checker
  const isParentAlive = (val: any) => {
    if (val === undefined || val === null) return true;
    return val === true || val === 1 || val === "1" || val === "true";
  };

  const lastInitializedId = useRef<number | null>(null);

  useEffect(() => {
    if (investorInfo) {
      if (lastInitializedId.current !== investorId) {
        setLocalFatherAlive(isParentAlive(investorInfo.father_alive));
        setLocalMotherAlive(isParentAlive(investorInfo.mother_alive));
        lastInitializedId.current = investorId;
      }
    } else {
      // If investorInfo is not loaded, reset ref so it initializes when loaded
      lastInitializedId.current = null;
    }
  }, [investorInfo, investorId]);

  const [createFamilyMember, { isLoading: isCreating }] = useCreateInvestorFamilyMemberMutation();
  const [updateFamilyMember, { isLoading: isUpdating }] = useUpdateInvestorFamilyMemberMutation();
  const [deleteFamilyMember, { isLoading: isDeleting }] = useDeleteInvestorFamilyMemberMutation();

  // Form State
  const [editingMember, setEditingMember] = useState<InvestorFamilyMember | null>(null);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<"mother" | "father" | "child" | "wife">("wife");
  const [mobileNumber, setMobileNumber] = useState("");
  const [nidNumber, setNidNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isAlive, setIsAlive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [nidFrontFile, setNidFrontFile] = useState<File | null>(null);
  const [nidFrontPreview, setNidFrontPreview] = useState<string | null>(null);
  const [nidBackFile, setNidBackFile] = useState<File | null>(null);
  const [nidBackPreview, setNidBackPreview] = useState<string | null>(null);

  const familyMembers = familyData?.data || [];

  // Helper to determine the first available relationship
  const getFirstAvailableRelationship = (taken: string[]) => {
    if (!taken.includes("wife")) return "wife";
    if (!taken.includes("child")) return "child";
    if (!taken.includes("father")) return "father";
    if (!taken.includes("mother")) return "mother";
    return "child";
  };

  const takenRelationships = useMemo(() => {
    const taken = familyMembers
      .filter((m) => !editingMember || m.id !== editingMember.id)
      .map((m) => m.relationship);

    if (!localFatherAlive) {
      taken.push("father");
    }
    if (!localMotherAlive) {
      taken.push("mother");
    }
    return taken;
  }, [familyMembers, editingMember, localFatherAlive, localMotherAlive]);

  // Reset Form
  const resetForm = () => {
    setEditingMember(null);
    setName("");
    
    const taken = familyMembers.map((m) => m.relationship);
    if (!localFatherAlive) taken.push("father");
    if (!localMotherAlive) taken.push("mother");
    setRelationship(getFirstAvailableRelationship(taken));
    
    setMobileNumber("");
    setNidNumber("");
    setDateOfBirth("");
    setIsAlive(true);
    setImageFile(null);
    setImagePreview(null);
    setNidFrontFile(null);
    setNidFrontPreview(null);
    setNidBackFile(null);
    setNidBackPreview(null);
  };

  // Auto-adjust relationship if currently selected one gets registered/taken
  useEffect(() => {
    if (!editingMember && relationship !== "child" && takenRelationships.includes(relationship)) {
      setRelationship(getFirstAvailableRelationship(takenRelationships));
    }
  }, [familyMembers, editingMember, relationship, takenRelationships]);

  // Set form for editing
  const handleEditClick = (member: InvestorFamilyMember) => {
    setEditingMember(member);
    setName(member.name);
    setRelationship(member.relationship);
    setMobileNumber(member.mobile_number || "");
    setNidNumber(member.nid_number || "");
    setDateOfBirth(member.date_of_birth || "");
    setIsAlive(Boolean(member.is_alive));
    setImageFile(null);
    setImagePreview(member.image || null);
    setNidFrontFile(null);
    setNidFrontPreview(member.nid_front_image || null);
    setNidBackFile(null);
    setNidBackPreview(member.nid_back_image || null);
  };

  // Handle image changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!isAlive) {
      toast.error("Family member must be alive to be registered (system validation).");
      return;
    }

    if (relationship !== "child" && takenRelationships.includes(relationship)) {
      toast.error(`A ${relationship} is already registered for this investor.`);
      return;
    }

    const payload: any = {
      name,
      relationship,
      is_alive: true, // Must be true/1
    };

    if (mobileNumber.trim()) payload.mobile_number = mobileNumber.trim();
    if (nidNumber.trim()) payload.nid_number = nidNumber.trim();
    if (dateOfBirth) payload.date_of_birth = dateOfBirth;
    if (imageFile) payload.image = imageFile;
    if (nidFrontFile) payload.nid_front_image = nidFrontFile;
    if (nidBackFile) payload.nid_back_image = nidBackFile;

    try {
      if (editingMember) {
        await updateFamilyMember({
          investorId,
          familyMemberId: editingMember.id,
          data: payload,
        }).unwrap();
        toast.success("Family member updated successfully");
      } else {
        await createFamilyMember({
          investorId,
          data: payload,
        }).unwrap();
        toast.success("Family member added successfully");
      }
      resetForm();
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save family member. Please check details.");
    }
  };

  const handleDeleteClick = async (memberId: number) => {
    if (!confirm("Are you sure you want to delete this family member?")) return;
    try {
      await deleteFamilyMember({ investorId, familyMemberId: memberId }).unwrap();
      toast.success("Family member deleted successfully");
      if (editingMember?.id === memberId) {
        resetForm();
      }
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete family member");
    }
  };

  // Reset form when modal state changes
  useEffect(() => {
    if (!open) {
      resetForm();
    } else {
      const taken = familyMembers.map((m) => m.relationship);
      if (!localFatherAlive) taken.push("father");
      if (!localMotherAlive) taken.push("mother");
      setRelationship(getFirstAvailableRelationship(taken));
    }
  }, [open, familyMembers, localFatherAlive, localMotherAlive]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border-gray-100 shadow-2xl">
        <DialogHeader className="px-6 py-5 border-b border-gray-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold text-[#0B1B3D]">
            Family Members of {investorName}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Manage relationships, contact details, identification, and profile images for the investor's family.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Left Panel: List of Members */}
          <div className="md:col-span-7 p-6 flex flex-col h-full overflow-y-auto min-h-[300px]">
            <h3 className="font-bold text-gray-700 text-sm mb-4 flex items-center justify-between">
              <span>Registered Members ({familyMembers.length})</span>
              {editingMember && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="h-7 text-xs text-primary hover:bg-primary/5 px-2"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add New Instead
                </Button>
              )}
            </h3>

            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-2 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#0B1B3D]" />
                <span className="text-xs font-semibold">Loading family list...</span>
              </div>
            ) : familyMembers.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-center">
                <User className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-600">No family members registered</p>
                <p className="text-xs text-gray-400 mt-1">Use the form on the right to register the first family member.</p>
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 ${
                      editingMember?.id === member.id
                        ? "border-[#0B1B3D] bg-slate-50/70 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-xs"
                    }`}
                  >
                    <Avatar className="w-12 h-12 border border-gray-100 bg-gray-50">
                      <AvatarImage src={member.image || ""} alt={member.name} />
                      <AvatarFallback className="bg-slate-100 text-[#0B1B3D] font-bold text-sm uppercase">
                        {member.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{member.name}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#0B1B3D] border border-slate-200">
                          {member.relationship}
                        </span>
                        {Boolean(member.is_alive) ? (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Alive
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Dead
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                        {member.mobile_number && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{member.mobile_number}</span>
                          </div>
                        )}
                        {member.nid_number && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Shield className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">NID: {member.nid_number}</span>
                          </div>
                        )}
                        {member.date_of_birth && (
                          <div className="flex items-center gap-1.5 sm:col-span-2 mt-0.5 truncate">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>DOB: {new Date(member.date_of_birth).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}</span>
                          </div>
                        )}
                      </div>

                      {(member.nid_front_image || member.nid_back_image) && (
                        <div className="flex gap-2 mt-2 pt-2 border-t border-gray-50">
                          {member.nid_front_image && (
                            <div className="relative group/nid w-16 h-10 border border-gray-100 rounded-md overflow-hidden bg-slate-50 cursor-pointer shadow-xs">
                              <img src={member.nid_front_image} className="w-full h-full object-cover animate-fade-in" alt="NID Front" />
                              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 opacity-0 group-hover/nid:opacity-100 transition-opacity">Front</span>
                            </div>
                          )}
                          {member.nid_back_image && (
                            <div className="relative group/nid w-16 h-10 border border-gray-100 rounded-md overflow-hidden bg-slate-50 cursor-pointer shadow-xs">
                              <img src={member.nid_back_image} className="w-full h-full object-cover animate-fade-in" alt="NID Back" />
                              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 opacity-0 group-hover/nid:opacity-100 transition-opacity">Back</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(member)}
                        className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(member.id)}
                        disabled={isDeleting}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Add/Edit Form */}
          <form onSubmit={handleSubmit} className="md:col-span-5 p-6 bg-slate-50/50 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm pb-2 border-b border-gray-100">
                {editingMember ? "Modify Member Details" : "Register Family Member"}
              </h3>

              {/* Parent Alive Status Settings */}
              <div className="bg-slate-100/70 border border-slate-200/50 p-4 rounded-xl space-y-3 shadow-xs">
                <h4 className="font-extrabold text-xs text-[#0B1B3D] uppercase tracking-wider">Investor's Parent Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={localFatherAlive}
                      disabled={isUpdatingParent}
                      onChange={async (e) => {
                        const checked = e.target.checked;
                        setLocalFatherAlive(checked);
                        try {
                          await updateParentStatus({
                            id: investorId,
                            father_alive: checked,
                            mother_alive: localMotherAlive,
                          }).unwrap();
                          toast.success("Investor father status updated");
                          refetchInvestor();
                        } catch (err) {
                          setLocalFatherAlive(!checked);
                          toast.error("Failed to update father status");
                        }
                      }}
                      className="w-4 h-4 text-[#0B1B3D] focus:ring-[#0B1B3D] rounded border-input"
                    />
                    <span>Father is Alive</span>
                  </label>
                  
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={localMotherAlive}
                      disabled={isUpdatingParent}
                      onChange={async (e) => {
                        const checked = e.target.checked;
                        setLocalMotherAlive(checked);
                        try {
                          await updateParentStatus({
                            id: investorId,
                            father_alive: localFatherAlive,
                            mother_alive: checked,
                          }).unwrap();
                          toast.success("Investor mother status updated");
                          refetchInvestor();
                        } catch (err) {
                          setLocalMotherAlive(!checked);
                          toast.error("Failed to update mother status");
                        }
                      }}
                      className="w-4 h-4 text-[#0B1B3D] focus:ring-[#0B1B3D] rounded border-input"
                    />
                    <span>Mother is Alive</span>
                  </label>
                </div>
              </div>

              {/* Avatar Field with upload */}
              <div className="flex flex-col items-center space-y-2 py-2">
                <div className="relative group cursor-pointer">
                  <Avatar className="w-20 h-20 border-2 border-white bg-white shadow-md">
                    <AvatarImage src={imagePreview || ""} />
                    <AvatarFallback className="bg-slate-200 text-slate-500 font-bold uppercase text-lg">
                      {name ? name.slice(0, 2) : <User className="w-8 h-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="family-image-upload"
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </label>
                  <input
                    id="family-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <span className="text-[10px] font-semibold text-gray-400">Optional profile image</span>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fam-name" className="text-xs font-bold text-gray-700">Full Name *</Label>
                <Input
                  id="fam-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="h-9 bg-white"
                  required
                />
              </div>

              {/* Relationship */}
              <div className="space-y-1.5">
                <Label htmlFor="fam-relationship" className="text-xs font-bold text-gray-700">Relationship *</Label>
                <select
                  id="fam-relationship"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-white px-3 py-1.5 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring h-9"
                  required
                >
                  <option value="wife" disabled={takenRelationships.includes("wife")}>
                    Wife {takenRelationships.includes("wife") ? "(Already exists)" : ""}
                  </option>
                  <option value="child">Child</option>
                  <option value="father" disabled={takenRelationships.includes("father")}>
                    Father {!localFatherAlive ? " (Deceased in profile)" : takenRelationships.includes("father") ? " (Already exists)" : ""}
                  </option>
                  <option value="mother" disabled={takenRelationships.includes("mother")}>
                    Mother {!localMotherAlive ? " (Deceased in profile)" : takenRelationships.includes("mother") ? " (Already exists)" : ""}
                  </option>
                </select>
              </div>

              {/* Mobile Number & NID Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fam-mobile" className="text-xs font-bold text-gray-700">Mobile No</Label>
                  <Input
                    id="fam-mobile"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. +880..."
                    className="h-9 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fam-nid" className="text-xs font-bold text-gray-700">NID Number</Label>
                  <Input
                    id="fam-nid"
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value)}
                    placeholder="e.g. 19934..."
                    className="h-9 bg-white"
                  />
                </div>
              </div>

              {/* Date of birth */}
              <div className="space-y-1.5">
                <Label htmlFor="fam-dob" className="text-xs font-bold text-gray-700">Date of Birth</Label>
                <Input
                  id="fam-dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="h-9 bg-white text-sm"
                />
              </div>

              {/* Is Alive (Radio Selection) */}
              <div className="space-y-2 pt-1">
                <Label className="text-xs font-bold text-gray-700 block">Status *</Label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="is_alive_radio"
                      checked={isAlive === true}
                      onChange={() => setIsAlive(true)}
                      className="w-4 h-4 text-[#0B1B3D] focus:ring-[#0B1B3D]"
                    />
                    <span>Alive</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="is_alive_radio"
                      checked={isAlive === false}
                      onChange={() => setIsAlive(false)}
                      className="w-4 h-4 text-[#0B1B3D] focus:ring-[#0B1B3D]"
                    />
                    <span>Dead</span>
                  </label>
                </div>
                {!isAlive && (
                  <p className="text-[10px] text-red-500 font-medium mt-1">
                    ⚠️ The backend validator requires family members to be alive for registration.
                  </p>
                )}
              </div>

              {/* NID Images Upload */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">NID Front Image</Label>
                  <div className="relative border border-dashed border-gray-300 rounded-lg p-2 bg-white flex flex-col items-center justify-center min-h-[90px] hover:border-gray-400 transition-colors cursor-pointer group">
                    {nidFrontPreview ? (
                      <div className="relative w-full h-16 rounded overflow-hidden">
                        <img src={nidFrontPreview} className="w-full h-full object-cover" alt="NID Front Preview" />
                        <label
                          htmlFor="nid-front-upload"
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] text-white font-bold"
                        >
                          Change
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="nid-front-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer py-1">
                        <Camera className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-[10px] text-gray-500 font-semibold">Upload Front</span>
                      </label>
                    )}
                    <input
                      id="nid-front-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNidFrontFile(file);
                          setNidFrontPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">NID Back Image</Label>
                  <div className="relative border border-dashed border-gray-300 rounded-lg p-2 bg-white flex flex-col items-center justify-center min-h-[90px] hover:border-gray-400 transition-colors cursor-pointer group">
                    {nidBackPreview ? (
                      <div className="relative w-full h-16 rounded overflow-hidden">
                        <img src={nidBackPreview} className="w-full h-full object-cover" alt="NID Back Preview" />
                        <label
                          htmlFor="nid-back-upload"
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] text-white font-bold"
                        >
                          Change
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="nid-back-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer py-1">
                        <Camera className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-[10px] text-gray-500 font-semibold">Upload Back</span>
                      </label>
                    )}
                    <input
                      id="nid-back-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNidBackFile(file);
                          setNidBackPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-6 border-t border-gray-100 mt-6">
              {editingMember && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                  className="h-9 flex-1"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="h-9 flex-1 bg-[#0B1B3D] hover:bg-[#0B1B3D]/95 text-white shadow-md flex items-center justify-center gap-1.5 text-xs font-bold"
              >
                {(isCreating || isUpdating) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editingMember ? "Save Changes" : "Register Member"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
