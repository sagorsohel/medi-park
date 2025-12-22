"use client";

import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface InstallmentRule {
    id: string;
    ruleId?: number; // Database ID for navigation
    name: string;
    payment_type: string;
    regular_price: string;
    offer_price: string;
    emi_amount: string;
    duration_months: string;
    status: boolean;
}

interface InstallmentRulesTableProps {
    rules: InstallmentRule[];
    selectedIds: string[];
    onSelectAll: (selected: boolean) => void;
    onSelectOne: (id: string, selected: boolean) => void;
    onStatusChange: (id: string, status: boolean) => void;
    onAction: (id: string, action: string) => void;
}

export function InstallmentRulesTable({
    rules,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onStatusChange,
    onAction,
}: InstallmentRulesTableProps) {
    const allSelected = rules.length > 0 && selectedIds.length === rules.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < rules.length;
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
                            Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
                            Payment Type
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
                            Regular Price
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
                            Offer Price
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
                            EMI Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
                            Duration (Months)
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
                    {rules.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                No installment rules found
                            </td>
                        </tr>
                    ) : (
                        rules.map((rule) => (
                            <tr key={rule.id} className="bg-card hover:bg-muted/50 border-b">
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(rule.id)}
                                        onChange={(e) => onSelectOne(rule.id, e.target.checked)}
                                        className="w-4 h-4 text-primary border-input rounded focus:ring-primary"
                                    />
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                    {rule.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                    {rule.payment_type}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                    {rule.regular_price}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                    {rule.offer_price}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                    {rule.emi_amount}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                    {rule.duration_months}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rule.status}
                                            onChange={(e) => onStatusChange(rule.id, e.target.checked)}
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
                                            <DropdownMenuItem onClick={() => onAction(rule.id, "edit")}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onAction(rule.id, "view")}>
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onAction(rule.id, "delete")}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

