"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobManageTab } from "@/components/admin/job/job-manage-tab";
import { JobApplicationsTab } from "@/components/admin/job/job-applications-tab";

export default function JobPostPage() {
    const [activeTab, setActiveTab] = useState("jobs");

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Post</h1>
                    <p className="text-gray-600">Manage job postings and applications</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-8 overflow-hidden bg-gray-100 rounded-lg p-1">
                    <TabsTrigger
                        value="jobs"
                        className="rounded-md px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm outline-none w-[200px]"
                    >
                        Job Manage
                    </TabsTrigger>
                    <TabsTrigger
                        value="applications"
                        className="rounded-md px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm outline-none w-[200px]"
                    >
                        Applicant Details
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="jobs">
                    <JobManageTab />
                </TabsContent>

                <TabsContent value="applications">
                    <JobApplicationsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
