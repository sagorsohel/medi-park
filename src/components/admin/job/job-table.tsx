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
import { Switch } from "@/components/ui/switch";
import { Settings, Eye, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Job {
    id: string;
    title: string;
    level: string;
    deadline: string;
    vacancy: string;
    status: boolean;
    originalId: number;
}

interface JobTableProps {
    jobs: Job[];
    selectedIds: string[];
    onSelectAll: (selected: boolean) => void;
    onSelectOne: (id: string, selected: boolean) => void;
    onStatusChange: (id: string, status: boolean) => void;
    onAction: (id: string, action: string) => void;
}

export function JobTable({
    jobs,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onStatusChange,
    onAction,
}: JobTableProps) {
    const allSelected = jobs.length > 0 && selectedIds.length === jobs.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < jobs.length;

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
                        <TableHead className="font-semibold text-gray-700"># ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">Job Title</TableHead>
                        <TableHead className="font-semibold text-gray-700">Level</TableHead>
                        <TableHead className="font-semibold text-gray-700">Vacancy</TableHead>
                        <TableHead className="font-semibold text-gray-700">Deadline</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">Status</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700 p-4">
                            <Settings className="h-4 w-4 ml-auto" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {jobs.map((job) => (
                        <TableRow key={job.id} className="hover:bg-gray-50/50">
                            <TableCell className="p-4">
                                <Checkbox
                                    checked={selectedIds.includes(job.id)}
                                    onCheckedChange={(checked) =>
                                        onSelectOne(job.id, checked as boolean)
                                    }
                                />
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                                {job.id}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                                {job.title}
                            </TableCell>
                            <TableCell className="text-gray-600">{job.level}</TableCell>
                            <TableCell className="text-gray-600">{job.vacancy}</TableCell>
                            <TableCell className="text-gray-600">{job.deadline}</TableCell>
                            <TableCell className="text-center">
                                <Switch
                                    checked={job.status}
                                    onCheckedChange={(checked) =>
                                        onStatusChange(job.id, checked)
                                    }
                                    className="mx-auto"
                                />
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
                                            onClick={() => onAction(job.originalId.toString(), "view")}
                                            className="cursor-pointer"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onAction(job.originalId.toString(), "edit")}
                                            className="cursor-pointer"
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onAction(job.originalId.toString(), "delete")}
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
                    {jobs.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                                No jobs found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
