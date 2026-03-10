"use client";

import { useRef, useEffect } from "react";
import { ChevronDown, MoreHorizontal, Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export interface HealthCheckup {
    id: number;
    title: string;
    phone: string;
    room_no: string;
    status: "active" | "inactive";
}

interface HealthCheckupTableProps {
    items: HealthCheckup[];
    selectedIds: number[];
    onSelectAll: (selected: boolean) => void;
    onSelectOne: (id: number, selected: boolean) => void;
    onStatusChange: (id: number, status: boolean) => void;
    onAction: (id: number, action: string) => void;
}

export function HealthCheckupTable({
    items,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onStatusChange,
    onAction,
}: HealthCheckupTableProps) {
    const allSelected = items.length > 0 && selectedIds.length === items.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < items.length;
    const checkboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = someSelected;
        }
    }, [someSelected]);

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-left border-b w-12">
                            <input
                                ref={checkboxRef}
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) => onSelectAll(e.target.checked)}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary transition-all cursor-pointer"
                            />
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 border-b uppercase tracking-wider">
                            Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 border-b uppercase tracking-wider">
                            Phone
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 border-b uppercase tracking-wider">
                            Room No
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 border-b uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 border-b uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(item.id)}
                                    onChange={(e) => onSelectOne(item.id, e.target.checked)}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary transition-all cursor-pointer"
                                />
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                    {item.title}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-gray-600 font-medium">
                                    {item.phone}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-semibold px-2.5 py-0.5 rounded-md">
                                    {item.room_no}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onStatusChange(item.id, item.status !== "active")}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${item.status === "active" ? "bg-primary" : "bg-gray-200"
                                        }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${item.status === "active" ? "translate-x-5" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-gray-100 p-1">
                                        <DropdownMenuItem
                                            onClick={() => onAction(item.id, "edit")}
                                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Edit2 className="w-4 h-4 text-blue-500" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onAction(item.id, "delete")}
                                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
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
