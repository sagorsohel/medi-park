"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { DataTableFilters } from "@/components/ui/data-table-filters";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { StaffTable, type StaffMember } from "@/components/admin/staff-table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetEmployeesQuery, useDeleteEmployeeMutation, useUpdateEmployeeMutation, type Employee } from "@/services/employeeApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmployeeDepartmentDialog } from "@/components/admin/employee-department-dialog";
import toast from "react-hot-toast";

export default function StaffPage() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [deptDialogOpen, setDeptDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useGetEmployeesQuery({
    page: currentPage,
    limit: 12,
    search: searchQuery,
  });

  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  // Refetch when page or search query changes
  useEffect(() => {
    refetch();
  }, [currentPage, searchQuery, refetch]);

  // Map API employees to table format
  const mappedStaff: StaffMember[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((employee: Employee) => ({
      id: employee.employee_id,
      image: employee.profile_image || undefined,
      name: employee.full_name,
      role: employee.designation,
      joiningDate: employee.date_of_joining,
      address: employee.address || "N/A",
      mobileNo: employee.phone,
      email: employee.email,
      salary: employee.salary,
      status: employee.status === "active",
    }));
  }, [data]);

  // Filter staff locally based on active/inactive status
  const filteredStaff = useMemo(() => {
    let result = mappedStaff;

    if (filter === "active") {
      result = result.filter((staff) => staff.status);
    } else if (filter === "inactive") {
      result = result.filter((staff) => !staff.status);
    }

    return result;
  }, [filter, mappedStaff]);

  const pagination = data?.pagination;
  const showingFrom = pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
  const showingTo = pagination
    ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
    : 0;

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(filteredStaff.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleStatusChange = async (id: string, status: boolean) => {
    const employee = data?.data?.find((emp: Employee) => emp.employee_id === id);
    if (!employee) return;
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("first_name", employee.first_name);
      formData.append("last_name", employee.last_name);
      formData.append("email", employee.email);
      formData.append("phone", employee.phone);
      formData.append("date_of_birth", employee.date_of_birth);
      formData.append("gender", employee.gender);
      formData.append("date_of_joining", employee.date_of_joining);
      formData.append("designation", employee.designation);
      formData.append("salary", employee.salary);
      formData.append("status", status ? "active" : "inactive");

      await updateEmployee({ id: employee.id, formData }).unwrap();
      toast.success("Employee status updated successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const handleAction = (id: string, action: string) => {
    const employee = data?.data?.find((emp: Employee) => emp.employee_id === id);
    if (!employee) return;

    if (action === "delete") {
      setEmployeeToDelete(id);
      setDeleteConfirmOpen(true);
    } else if (action === "edit") {
      navigate(`/accounting/software/employees/edit/${employee.id}`);
    } else if (action === "view") {
      navigate(`/accounting/software/employees/view/${employee.id}`);
    }
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;

    const employee = data?.data?.find((emp: Employee) => emp.employee_id === employeeToDelete);
    if (!employee) return;

    try {
      await deleteEmployee(employee.id).unwrap();
      toast.success("Employee deleted successfully!");
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete employee:", error);
      toast.error("Failed to delete employee. Please try again.");
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`, selectedIds);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B1B3D] mb-2">Employees</h1>
          <p className="text-gray-600">Manage hospital staff records, designations, salaries, and profiles</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-[#0B1B3D] text-[#0B1B3D] hover:bg-[#0B1B3D]/10"
            onClick={() => setDeptDialogOpen(true)}
          >
            Manage Departments
          </Button>
          <Button
            variant="default"
            className="bg-[#0B1B3D] hover:bg-[#0B1B3D]/95 text-white"
            onClick={() => navigate("/accounting/software/employees/new")}
          >
            Add New Employee
          </Button>
        </div>
      </div>

      {/* Filters */}
      <DataTableFilters
        onBulkAction={handleBulkAction}
        onFilterChange={handleFilterChange}
        onSearch={setSearchQuery}
        searchPlaceholder="Search employees by name, email, or role..."
      />

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0B1B3D]" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <StaffTable
            staff={filteredStaff}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onStatusChange={handleStatusChange}
            onAction={handleAction}
          />
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total_page > 1 && (
        <DataTablePagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_page}
          totalEntries={pagination.total_count}
          entriesPerPage={pagination.per_page}
          onPageChange={setCurrentPage}
          showingFrom={showingFrom}
          showingTo={showingTo}
        />
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDelete}
        title="Delete Employee"
        description="Are you sure you want to delete this employee record? This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      <EmployeeDepartmentDialog
        open={deptDialogOpen}
        onOpenChange={setDeptDialogOpen}
      />
    </div>
  );
}
