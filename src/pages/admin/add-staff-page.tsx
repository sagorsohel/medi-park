import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Upload,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Briefcase,
  MapPin,
  Loader2,
  FileText,
  Trash2,
  Building2,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/services/employeeApi";
import { useGetEmployeeDepartmentsQuery } from "@/services/employeeDepartmentApi";
import toast from "react-hot-toast";

export default function AddStaffPage() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const employeeId = params.id ? parseInt(params.id) : null;

  const pathname = window.location.pathname;
  const isViewMode = pathname.includes("/view/");
  const isEditMode = pathname.includes("/edit/");
  const isCreateMode = !employeeId && !isEditMode && !isViewMode;

  const { data: employeeData, isLoading } = useGetEmployeeByIdQuery(employeeId!, {
    skip: !employeeId,
  });
  const { data: deptsData } = useGetEmployeeDepartmentsQuery();
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

  // Form Field States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [designation, setDesignation] = useState("");
  const [salary, setSalary] = useState("");
  const [status, setStatus] = useState("active");
  const [departmentId, setDepartmentId] = useState("");
  const [address, setAddress] = useState("");

  // File States and Previews
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const [resume, setResume] = useState<File | null>(null);

  const [nidFrontImage, setNidFrontImage] = useState<File | null>(null);
  const [nidFrontPreview, setNidFrontPreview] = useState<string | null>(null);

  const [nidBackImage, setNidBackImage] = useState<File | null>(null);
  const [nidBackPreview, setNidBackPreview] = useState<string | null>(null);

  // Load existing employee data
  useEffect(() => {
    if (employeeData?.data) {
      const emp = employeeData.data;
      setFirstName(emp.first_name || "");
      setLastName(emp.last_name || "");
      setEmail(emp.email || "");
      setPhone(emp.phone || "");
      setDateOfBirth(emp.date_of_birth || "");
      setGender(emp.gender || "");
      setDateOfJoining(emp.date_of_joining || "");
      setDesignation(emp.designation || "");
      setSalary(emp.salary || "");
      setStatus(emp.status || "active");
      setDepartmentId(emp.department_id ? String(emp.department_id) : "");
      setAddress(emp.address || "");

      setProfileImagePreview(emp.profile_image || null);
      setNidFrontPreview(emp.nid_front_image || null);
      setNidBackPreview(emp.nid_back_image || null);
    }
  }, [employeeData]);

  // Handle Input File Changes
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNidFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNidFrontImage(file);
      setNidFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleNidBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNidBackImage(file);
      setNidBackPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  const handleRemoveFile = (type: "profile" | "nid_front" | "nid_back" | "resume") => {
    if (type === "profile") {
      setProfileImage(null);
      setProfileImagePreview(null);
    } else if (type === "nid_front") {
      setNidFrontImage(null);
      setNidFrontPreview(null);
    } else if (type === "nid_back") {
      setNidBackImage(null);
      setNidBackPreview(null);
    } else if (type === "resume") {
      setResume(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !dateOfBirth ||
      !gender ||
      !dateOfJoining ||
      !designation ||
      !salary
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("date_of_birth", dateOfBirth);
      formData.append("gender", gender);
      formData.append("date_of_joining", dateOfJoining);
      formData.append("designation", designation);
      formData.append("salary", salary);
      formData.append("status", status);

      if (departmentId) formData.append("department_id", departmentId);
      if (address) formData.append("address", address);

      if (profileImage) formData.append("profile_image", profileImage);
      if (resume) formData.append("resume", resume);
      if (nidFrontImage) formData.append("nid_front_image", nidFrontImage);
      if (nidBackImage) formData.append("nid_back_image", nidBackImage);

      if (isEditMode && employeeId) {
        formData.append("_method", "PUT");
        await updateEmployee({ id: employeeId, formData }).unwrap();
        toast.success("Employee record updated successfully!");
      } else {
        await createEmployee(formData).unwrap();
        toast.success("Employee profile created successfully!");
      }

      navigate("/accounting/software/employees");
    } catch (err: any) {
      console.error("Failed to save employee:", err);
      const msg = err?.data?.message || "Failed to save employee profile. Please review the details.";
      toast.error(msg);
    }
  };

  if (isLoading && employeeId) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B1B3D]" />
      </div>
    );
  }

  const readOnlyProps = isViewMode ? { readOnly: true, disabled: true } : {};
  const departments = deptsData?.data || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl space-y-6">
      {/* Header */}
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
            {isCreateMode && "Add New Employee"}
            {isEditMode && "Edit Employee Details"}
            {isViewMode && "View Employee Profile"}
          </h1>
          <p className="text-xs text-slate-500">
            {isCreateMode && "Register a new hospital staff member and upload documents."}
            {isEditMode && "Modify fields, update designations, or upload new files."}
            {isViewMode && "Review staff profile, contact info, and attached files."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity & Basic Info Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3">Personal & Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee ID */}
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="font-bold text-gray-700">Employee ID</Label>
              <Input
                id="employeeId"
                value={employeeData?.data?.employee_id || "Auto Generate"}
                readOnly
                className="bg-blue-50/50 text-slate-500 border-blue-100 font-semibold"
              />
            </div>

            {/* Empty grid space */}
            <div className="hidden md:block"></div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-bold text-gray-700">First Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  className="pl-10"
                  required
                  {...readOnlyProps}
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-bold text-gray-700">Last Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Doe"
                  className="pl-10"
                  required
                  {...readOnlyProps}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-gray-700">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john.doe@example.com"
                  className="pl-10"
                  required
                  {...readOnlyProps}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-bold text-gray-700">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1-555-0199"
                  className="pl-10"
                  required
                  {...readOnlyProps}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="font-bold text-gray-700">Date of Birth *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="pl-10 block"
                  required
                  {...readOnlyProps}
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="font-bold text-gray-700">Gender *</Label>
              <Select
                value={gender}
                onValueChange={setGender}
                disabled={isViewMode}
              >
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="font-bold text-gray-700">Present Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete residential address here..."
                rows={3}
                className="pl-10"
                {...readOnlyProps}
              />
            </div>
          </div>
        </div>

        {/* Employment & Administration Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3">Employment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="designation" className="font-bold text-gray-700">Designation *</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Nurse, Accountant"
                  className="pl-10"
                  required
                  {...readOnlyProps}
                />
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary" className="font-bold text-gray-700">Salary *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 50000.00"
                  className="pl-10"
                  required
                  {...readOnlyProps}
                />
              </div>
            </div>

            {/* Joining Date */}
            <div className="space-y-2">
              <Label htmlFor="dateOfJoining" className="font-bold text-gray-700">Date of Joining *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="dateOfJoining"
                  type="date"
                  value={dateOfJoining}
                  onChange={(e) => setDateOfJoining(e.target.value)}
                  className="pl-10 block"
                  required
                  {...readOnlyProps}
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department" className="font-bold text-gray-700">Department</Label>
              <Select
                value={departmentId}
                onValueChange={setDepartmentId}
                disabled={isViewMode}
              >
                <SelectTrigger id="department" className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="font-bold text-gray-700">Status</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={isViewMode}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Documents & Images Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3">Attached Files & Documents</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Image upload card */}
            <div className="space-y-3">
              <Label className="font-bold text-gray-700">Profile Image</Label>
              {!isViewMode && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary/50 transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1 text-slate-500">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                    <p className="text-xs font-semibold">Upload Photo</p>
                  </div>
                </div>
              )}

              {profileImagePreview ? (
                <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm mt-2 mx-auto">
                  <img src={profileImagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile("profile")}
                      className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-xs py-2 flex items-center gap-1.5 justify-center border border-gray-50 rounded-xl bg-gray-50/50">
                  <ImageIcon className="w-4 h-4" /> No photo uploaded
                </div>
              )}
            </div>

            {/* Resume Upload Card */}
            <div className="space-y-3">
              <Label className="font-bold text-gray-700">Resume / CV</Label>
              {!isViewMode && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary/50 transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1 text-slate-500">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                    <p className="text-xs font-semibold">Upload Document (PDF/Word)</p>
                  </div>
                </div>
              )}

              {resume ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl mt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="truncate max-w-[200px] font-semibold">{resume.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveFile("resume")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : employeeData?.data?.resume ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl mt-2">
                  <a
                    href={employeeData.data.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-semibold"
                  >
                    <FileText className="w-4 h-4" />
                    View Existing Resume
                  </a>
                </div>
              ) : (
                <div className="text-gray-400 text-xs py-2 flex items-center gap-1.5 justify-center border border-gray-50 rounded-xl bg-gray-50/50">
                  <FileText className="w-4 h-4" /> No resume attached
                </div>
              )}
            </div>

            {/* NID Front Image card */}
            <div className="space-y-3">
              <Label className="font-bold text-gray-700">National ID Front Image</Label>
              {!isViewMode && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary/50 transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNidFrontChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1 text-slate-500">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                    <p className="text-xs font-semibold">Upload ID Front</p>
                  </div>
                </div>
              )}

              {nidFrontPreview ? (
                <div className="relative w-full h-36 rounded-lg overflow-hidden border border-gray-200 shadow-sm mt-2">
                  <img src={nidFrontPreview} alt="NID Front Preview" className="w-full h-full object-contain bg-slate-50" />
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile("nid_front")}
                      className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-xs py-2 flex items-center gap-1.5 justify-center border border-gray-50 rounded-xl bg-gray-50/50">
                  <ImageIcon className="w-4 h-4" /> No ID Front uploaded
                </div>
              )}
            </div>

            {/* NID Back Image card */}
            <div className="space-y-3">
              <Label className="font-bold text-gray-700">National ID Back Image</Label>
              {!isViewMode && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary/50 transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNidBackChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1 text-slate-500">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                    <p className="text-xs font-semibold">Upload ID Back</p>
                  </div>
                </div>
              )}

              {nidBackPreview ? (
                <div className="relative w-full h-36 rounded-lg overflow-hidden border border-gray-200 shadow-sm mt-2">
                  <img src={nidBackPreview} alt="NID Back Preview" className="w-full h-full object-contain bg-slate-50" />
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile("nid_back")}
                      className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-xs py-2 flex items-center gap-1.5 justify-center border border-gray-50 rounded-xl bg-gray-50/50">
                  <ImageIcon className="w-4 h-4" /> No ID Back uploaded
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/accounting/software/employees")}
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
              {isEditMode ? "Update Profile" : "Register Employee"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
