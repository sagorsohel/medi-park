import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Settings, Eye, Trash2, Download } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface JobApplicationData {
    id: string;
    name: string;
    email: string;
    phone: string;
    jobAppliedFor: string;
    appliedAt: string;
    resumeUrl?: string;
    originalId: number;
}

interface JobApplicationTableProps {
    applications: JobApplicationData[];
    selectedIds: string[];
    onSelectAll: (selected: boolean) => void;
    onSelectOne: (id: string, selected: boolean) => void;
    onAction: (id: string, action: string) => void;
}

export function JobApplicationTable({
    applications,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onAction,
}: JobApplicationTableProps) {
    const allSelected = applications.length > 0 && selectedIds.length === applications.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < applications.length;

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader className="bg-[#f8fafc]">
                    <TableRow>
                        <TableHead className="w-[50px] p-4">
                            <Checkbox
                                checked={someSelected ? "indeterminate" : allSelected}
                                onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                            />
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">Applicant Name</TableHead>
                        <TableHead className="font-semibold text-gray-700">Email</TableHead>
                        <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                        <TableHead className="font-semibold text-gray-700">Job Title</TableHead>
                        <TableHead className="font-semibold text-gray-700">Applied At</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">Resume</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700 p-4">
                            <Settings className="h-4 w-4 ml-auto" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.map((app) => (
                        <TableRow key={app.id} className="hover:bg-gray-50/50">
                            <TableCell className="p-4">
                                <Checkbox
                                    checked={selectedIds.includes(app.id)}
                                    onCheckedChange={(checked) =>
                                        onSelectOne(app.id, checked as boolean)
                                    }
                                />
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                                {app.name}
                            </TableCell>
                            <TableCell className="text-gray-600">{app.email}</TableCell>
                            <TableCell className="text-gray-600">{app.phone}</TableCell>
                            <TableCell className="text-gray-600">{app.jobAppliedFor}</TableCell>
                            <TableCell className="text-gray-600">
                                {new Date(app.appliedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-center">
                                {app.resumeUrl ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => window.open(app.resumeUrl, "_blank")}
                                    >
                                        <Download className="h-4 w-4 text-blue-600" />
                                    </Button>
                                ) : (
                                    <span className="text-gray-400 text-sm">N/A</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right p-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => onAction(app.originalId.toString(), "view")}
                                            className="cursor-pointer"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onAction(app.originalId.toString(), "delete")}
                                            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {applications.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                                No applications found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
