"use client";

import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface StaffMember {
  id: string;
  image?: string;
  name: string;
  role: string;
  joiningDate: string;
  address: string;
  mobileNo: string;
  email: string;
  salary: string;
  status: boolean;
}

interface StaffTableProps {
  staff: StaffMember[];
  selectedIds: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectOne: (id: string, selected: boolean) => void;
  onStatusChange: (id: string, status: boolean) => void;
  onAction: (id: string, action: string) => void;
}

export function StaffTable({
  staff,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onStatusChange,
  onAction,
}: StaffTableProps) {
  const allSelected = staff.length > 0 && selectedIds.length === staff.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < staff.length;
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[1200px]">
        <thead>
          <tr className="bg-muted/50">
            <th className="px-4 py-3 text-left border-b">
              <input
                ref={checkboxRef}
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 text-primary border-input rounded focus:ring-primary"
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              ID No
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Image
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Staff Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Role
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Joining Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Address
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Mobile No
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Salary
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id} className="bg-card hover:bg-muted/50 border-b">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(member.id)}
                  onChange={(e) => onSelectOne(member.id, e.target.checked)}
                  className="w-4 h-4 text-primary border-input rounded focus:ring-primary"
                />
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                {member.id}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="bg-secondary text-primary">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                {member.name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                {member.role}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                {member.joiningDate}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                {member.address}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                {member.mobileNo}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                {member.email}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                {member.salary}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={member.status}
                    onChange={(e) => onStatusChange(member.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-input peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white border-gray-300 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1"
                    >
                      Action
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onAction(member.id, "edit")}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction(member.id, "view")}>
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction(member.id, "delete")}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

