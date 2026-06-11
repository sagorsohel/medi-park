"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetEmployeeDepartmentsQuery,
  useCreateEmployeeDepartmentMutation,
  useUpdateEmployeeDepartmentMutation,
  useDeleteEmployeeDepartmentMutation,
  type EmployeeDepartment,
} from "@/services/employeeDepartmentApi";
import { useGetEmployeesQuery } from "@/services/employeeApi";
import { Plus, Edit, Trash2, Loader2, ChevronLeft, Building2 } from "lucide-react";
import toast from "react-hot-toast";

interface EmployeeDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeDepartmentDialog({
  open,
  onOpenChange,
}: EmployeeDepartmentDialogProps) {
  const [viewState, setViewState] = useState<"list" | "form">("list");
  const [editingDept, setEditingDept] = useState<EmployeeDepartment | null>(null);

  // Form States
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [headEmployeeId, setHeadEmployeeId] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Queries & Mutations
  const { data: deptsData, isLoading: isLoadingDepts, refetch: refetchDepts } =
    useGetEmployeeDepartmentsQuery(undefined, { skip: !open });
  const { data: employeesData } = useGetEmployeesQuery(
    { limit: 100 },
    { skip: !open || viewState !== "form" }
  );

  const [createDept, { isLoading: isCreating }] = useCreateEmployeeDepartmentMutation();
  const [updateDept, { isLoading: isUpdating }] = useUpdateEmployeeDepartmentMutation();
  const [deleteDept, { isLoading: isDeleting }] = useDeleteEmployeeDepartmentMutation();

  const employees = employeesData?.data || [];
  const departments = deptsData?.data || [];

  const handleOpenForm = (dept?: EmployeeDepartment) => {
    if (dept) {
      setEditingDept(dept);
      setName(dept.name || "");
      setCode(dept.code || "");
      setDescription(dept.description || "");
      setHeadEmployeeId(dept.head_employee_id ? String(dept.head_employee_id) : "");
      setIsActive(!!dept.is_active);
    } else {
      setEditingDept(null);
      setName("");
      setCode("");
      setDescription("");
      setHeadEmployeeId("");
      setIsActive(true);
    }
    setViewState("form");
  };

  const handleCloseForm = () => {
    setViewState("list");
    setEditingDept(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Department name is required.");
      return;
    }

    try {
      const payload = {
        name,
        code: code || null,
        description: description || null,
        head_employee_id: headEmployeeId ? parseInt(headEmployeeId) : null,
        is_active: isActive,
      };

      if (editingDept) {
        await updateDept({ id: editingDept.id, data: payload }).unwrap();
        toast.success("Department updated successfully!");
      } else {
        await createDept(payload).unwrap();
        toast.success("Department created successfully!");
      }
      refetchDepts();
      handleCloseForm();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to save department. Ensure Code is unique.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteDept(id).unwrap();
      toast.success("Department deleted successfully!");
      refetchDepts();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete department.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold text-[#0B1B3D] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Employee Departments
          </DialogTitle>
        </DialogHeader>

        {viewState === "list" ? (
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            <div className="flex justify-between items-center shrink-0">
              <span className="text-sm text-gray-500">
                Define internal department structures and assign heads.
              </span>
              <Button
                onClick={() => handleOpenForm()}
                className="bg-[#0B1B3D] hover:bg-[#0B1B3D]/95 text-white flex items-center gap-1.5"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            </div>

            {isLoadingDepts ? (
              <div className="flex-1 flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#0B1B3D]" />
              </div>
            ) : departments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl p-12 text-center text-slate-400">
                <Building2 className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-semibold">No departments found</p>
                <p className="text-xs">Click "Add Department" to register a new department structure.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto border border-gray-100 rounded-xl">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 font-semibold text-slate-600">
                      <th className="px-4 py-2.5">Code</th>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Head Employee</th>
                      <th className="px-4 py-2.5 w-[80px]">Status</th>
                      <th className="px-4 py-2.5 w-[100px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-slate-50/50 border-b border-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-slate-600 font-semibold">
                          {dept.code || "-"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{dept.name}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {dept.head_employee?.full_name || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              dept.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {dept.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-600 hover:text-primary"
                              onClick={() => handleOpenForm(dept)}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-600 hover:text-red-600"
                              onClick={() => handleDelete(dept.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="flex items-center gap-1 -ml-1 text-slate-600 hover:text-slate-900 mb-2">
              <Button type="button" variant="ghost" size="sm" onClick={handleCloseForm} className="h-8 gap-1">
                <ChevronLeft className="w-4 h-4" />
                Back to Departments
              </Button>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="deptName" className="font-bold text-slate-700">Department Name *</Label>
              <Input
                id="deptName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rheumatology, Accounting"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Code */}
              <div className="space-y-1.5">
                <Label htmlFor="deptCode" className="font-bold text-slate-700">Department Code</Label>
                <Input
                  id="deptCode"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. RHU, ACC"
                />
              </div>

              {/* Head Employee Selection */}
              <div className="space-y-1.5">
                <Label htmlFor="headEmployee" className="font-bold text-slate-700">Head Employee</Label>
                <select
                  id="headEmployee"
                  value={headEmployeeId}
                  onChange={(e) => setHeadEmployeeId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select Department Head</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="font-bold text-slate-700">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a brief description of the department's focus..."
                rows={3}
              />
            </div>

            {/* Status Checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-primary border-input rounded focus:ring-primary cursor-pointer"
              />
              <Label htmlFor="isActive" className="font-semibold text-slate-700 cursor-pointer select-none">
                Is Active (Show in lists and forms)
              </Label>
            </div>

            {/* Form Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-[#0B1B3D] hover:bg-[#0B1B3D]/95 text-white flex items-center gap-1.5 min-w-[100px]"
              >
                {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingDept ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
