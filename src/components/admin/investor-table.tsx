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

export interface Investor {
    id: string;
    investorId?: number; // Database ID for navigation
    image?: string;
    name: string;
    email: string;
    mobile: string;
    status: boolean;
}

interface InvestorTableProps {
    investors: Investor[];
    selectedIds: string[];
    onSelectAll: (selected: boolean) => void;
    onSelectOne: (id: string, selected: boolean) => void;
    onStatusChange: (id: string, status: boolean) => void;
    onAction: (id: string, action: string) => void;
}

export function InvestorTable({
    investors,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onStatusChange,
    onAction,
}: InvestorTableProps) {
    const allSelected = investors.length > 0 && selectedIds.length === investors.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < investors.length;
    const checkboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = someSelected;
        }
    }, [someSelected]);

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px]">
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
                            Investor ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
                            Image
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
                            Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
                            Mobile
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
                    {investors.map((investor) => (
                        <tr key={investor.id} className="bg-card hover:bg-muted/50 border-b">
                            <td className="px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(investor.id)}
                                    onChange={(e) => onSelectOne(investor.id, e.target.checked)}
                                    className="w-4 h-4 text-primary border-input rounded focus:ring-primary"
                                />
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                {investor.id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={investor.image} alt={investor.name} />
                                    <AvatarFallback className="bg-secondary text-primary">
                                        {investor.name && investor.name.trim()
                                            ? investor.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()
                                                .slice(0, 2)
                                            : "IN"}
                                    </AvatarFallback>
                                </Avatar>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                {investor.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                {investor.email}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                {investor.mobile}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={investor.status}
                                        onChange={(e) => onStatusChange(investor.id, e.target.checked)}
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
                                        <DropdownMenuItem onClick={() => onAction(investor.id, "edit")}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onAction(investor.id, "view")}>
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onAction(investor.id, "delete")}>
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

