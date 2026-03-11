"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    FileText,
    ExternalLink,
    User,
    Clock,
    CheckCircle2,
    Info
} from "lucide-react";
import { type JobApplication } from "@/services/jobApi";

interface JobApplicationDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    application: JobApplication | null;
}

export function JobApplicationDetailModal({
    open,
    onOpenChange,
    application,
}: JobApplicationDetailModalProps) {
    if (!application) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="p-6 bg-gray-50/50 border-b shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-white shrink-0">
                                {application.image_url ? (
                                    <img
                                        src={application.image_url}
                                        alt={application.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                        <User className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900">
                                    {application.full_name}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-2 mt-1">
                                    <Briefcase className="w-4 h-4" />
                                    Applied for: <span className="font-semibold text-primary">{application.job_detail?.job_title || "N/A"}</span>
                                </DialogDescription>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant={application.status === 'pending' ? 'outline' : 'default'} className={
                                        application.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }>
                                        {application.status.toUpperCase()}
                                    </Badge>
                                    <Badge variant="secondary" className="flex gap-1 items-center">
                                        <Clock className="w-3 h-3" />
                                        {new Date(application.applied_at).toLocaleDateString()}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Contact & Addresses */}
                        <div className="md:col-span-1 space-y-6">
                            <section>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Info className="w-4 h-4" /> Contact Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700 p-2 rounded-lg hover:bg-gray-50">
                                        <Mail className="w-4 h-4 text-primary" />
                                        <span className="text-sm truncate" title={application.email}>{application.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700 p-2 rounded-lg hover:bg-gray-50">
                                        <Phone className="w-4 h-4 text-primary" />
                                        <span className="text-sm">{application.phone}</span>
                                    </div>
                                </div>
                            </section>

                            <Separator />

                            <section>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Addresses
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-[10px] font-bold text-primary uppercase mb-1">Present Address</p>
                                        <p className="text-sm text-gray-900 leading-relaxed font-medium">
                                            {application.present_address?.address}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            District: {application.present_address?.district}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Permanent Address</p>
                                        <p className="text-sm text-gray-900 leading-relaxed">
                                            {application.permanent_address?.address}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            District: {application.permanent_address?.district}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Job Specs & CV */}
                        <div className="md:col-span-2 space-y-6">
                            <section>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Application Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-xl bg-white shadow-sm transition-hover hover:shadow-md">
                                        <p className="text-xs text-gray-500 mb-1">Job Level</p>
                                        <p className="font-semibold text-gray-900">{application.job_detail?.job_level || "Not specified"}</p>
                                    </div>
                                    <div className="p-4 border rounded-xl bg-white shadow-sm transition-hover hover:shadow-md">
                                        <p className="text-xs text-gray-500 mb-1">Experience</p>
                                        <p className="font-semibold text-gray-900">{application.job_detail?.experience || "Not specified"}</p>
                                    </div>
                                    <div className="p-4 border rounded-xl bg-white shadow-sm transition-hover hover:shadow-md col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">Submission Date</p>
                                        <p className="font-semibold text-gray-900">{formatDate(application.created_at)}</p>
                                    </div>
                                </div>
                            </section>

                            <Separator />

                            <section>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Documents
                                </h3>
                                <div className="space-y-4">
                                    {application.cv_url ? (
                                        <div className="bg-white border rounded-xl p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">Curriculum Vitae (CV)</p>
                                                    <p className="text-xs text-gray-500">PDF Document</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="group-hover:bg-primary group-hover:text-white transition-all shadow-none"
                                                onClick={() => window.open(application.cv_url, "_blank")}
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                View CV
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="p-8 border-2 border-dashed rounded-xl text-center">
                                            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400">No CV uploaded for this application</p>
                                        </div>
                                    )}

                                    {/* Web-based CV Preview if PDF */}
                                    {application.cv_url && application.cv_url.toLowerCase().endsWith('.pdf') && (
                                        <div className="mt-4 rounded-xl border overflow-hidden h-96 bg-gray-100">
                                            <iframe
                                                src={`${application.cv_url}#toolbar=0`}
                                                className="w-full h-full"
                                                title="CV Preview"
                                            />
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3 shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
