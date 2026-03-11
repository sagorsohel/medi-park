"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    MapPin,
    Users,
    Briefcase,
    GraduationCap,
    ShieldCheck,
    Lightbulb,
    LayoutDashboard,
    Clock,
    DollarSign
} from "lucide-react";
import { type JobDetail } from "@/services/jobApi";

interface JobPostDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    job: JobDetail | null;
}

export function JobPostDetailModal({
    open,
    onOpenChange,
    job,
}: JobPostDetailModalProps) {
    if (!job) return null;

    const sections = [
        { title: "Purpose", content: job.purpose, icon: <LayoutDashboard className="w-5 h-5 text-blue-500" /> },
        { title: "General Job Description", content: job.general_job_description, icon: <Briefcase className="w-5 h-5 text-indigo-500" /> },
        { title: "Department Specific Job Description", content: job.department_specific_job_description, icon: <GraduationCap className="w-5 h-5 text-purple-500" /> },
        { title: "Training and Development", content: job.training_and_development, icon: <Lightbulb className="w-5 h-5 text-amber-500" /> },
        { title: "Prevention and Control of Infections", content: job.prevention_and_control_of_infections, icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> },
        { title: "Basic Competencies", content: job.basic_competencies, icon: <LayoutDashboard className="w-5 h-5 text-sky-500" /> },
        { title: "Behavioral Competencies", content: job.behavioral_competencies, icon: <Users className="w-5 h-5 text-rose-500" /> },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden shadow-2xl border-none">
                <DialogHeader className="p-8 bg-linear-to-r from-primary-900 via-primary-800 to-primary-700 text-white relative shrink-0">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <DialogTitle className="text-3xl font-extrabold tracking-tight">
                                {job.job_title}
                            </DialogTitle>
                            <Badge className={`${job.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500'} text-white border-none px-3 py-1`}>
                                {job.status.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-primary-50">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-200" />
                                <span className="text-sm">{job.job_location || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary-200" />
                                <span className="text-sm">{job.employment_status || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary-200" />
                                <span className="text-sm">Vacancy: {job.vacancy || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary-200" />
                                <span className="text-sm">Deadline: {job.deadline || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
                    <div className="p-8 space-y-10">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 rounded-xl border bg-blue-50/30 border-blue-100">
                                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Job Level</p>
                                <p className="text-gray-900 font-semibold">{job.job_level || "Not specified"}</p>
                            </div>
                            <div className="p-4 rounded-xl border bg-indigo-50/30 border-indigo-100">
                                <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Experience</p>
                                <p className="text-gray-900 font-semibold">{job.experience || "Not specified"}</p>
                            </div>
                            <div className="p-4 rounded-xl border bg-emerald-50/30 border-emerald-100">
                                <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Salary Range</p>
                                <p className="text-gray-900 font-semibold">{job.salary_range || "Negotiable"}</p>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-12">
                            {sections.map((section, idx) => section.content && (
                                <section key={idx} className="relative">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-gray-100">
                                            {section.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                                    </div>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-600 pl-11"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                    {idx < sections.length - 1 && <div className="mt-12 h-px bg-gray-100 ml-11" />}
                                </section>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-8">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
