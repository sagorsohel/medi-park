"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import {
    useGetJobDetailByIdQuery,
    useCreateJobDetailMutation,
    useUpdateJobDetailMutation,
} from "@/services/jobApi";

export default function AddJobPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const { data: jobData, isLoading: isFetching } = useGetJobDetailByIdQuery(Number(id), {
        skip: !isEditing,
    });

    const [createJob, { isLoading: isCreating }] = useCreateJobDetailMutation();
    const [updateJob, { isLoading: isUpdating }] = useUpdateJobDetailMutation();

    const [formData, setFormData] = useState({
        job_title: "",
        job_level: "",
        purpose: "",
        general_job_description: "",
        department_specific_job_description: "",
        training_and_development: "",
        prevention_and_control_of_infections: "",
        basic_competencies: "",
        behavioral_competencies: "",
        job_location: "",
        employment_status: "",
        experience: "",
        vacancy: "",
        salary_range: "",
        deadline: "",
        status: "active",
    });

    useEffect(() => {
        if (isEditing && jobData?.data) {
            setFormData({
                job_title: jobData.data.job_title || "",
                job_level: jobData.data.job_level || "",
                purpose: jobData.data.purpose || "",
                general_job_description: jobData.data.general_job_description || "",
                department_specific_job_description: jobData.data.department_specific_job_description || "",
                training_and_development: jobData.data.training_and_development || "",
                prevention_and_control_of_infections: jobData.data.prevention_and_control_of_infections || "",
                basic_competencies: jobData.data.basic_competencies || "",
                behavioral_competencies: jobData.data.behavioral_competencies || "",
                job_location: jobData.data.job_location || "",
                employment_status: jobData.data.employment_status || "",
                experience: jobData.data.experience || "",
                vacancy: jobData.data.vacancy || "",
                salary_range: jobData.data.salary_range || "",
                deadline: jobData.data.deadline || "",
                status: jobData.data.status || "active",
            });
        }
    }, [isEditing, jobData]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.job_title) {
            toast.error("Job title is required");
            return;
        }

        try {
            if (isEditing) {
                await updateJob({
                    id: Number(id),
                    data: formData,
                }).unwrap();
                toast.success("Job updated successfully!");
            } else {
                await createJob(formData).unwrap();
                toast.success("Job created successfully!");
            }
            navigate("/admin/job-posts");
        } catch (error) {
            console.error("Failed to save job:", error);
            toast.error("Failed to save job. Please try again.");
        }
    };

    if (isEditing && isFetching) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    const isLoading = isCreating || isUpdating;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate("/admin/job-posts")}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isEditing ? "Edit Job Post" : "Add New Job Post"}
                    </h1>
                    <p className="text-gray-600">
                        {isEditing ? "Update job details below" : "Fill in the details for the new job role"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field>
                                    <FieldLabel>Job Title *</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            value={formData.job_title}
                                            onChange={(e) => handleChange("job_title", e.target.value)}
                                            placeholder="e.g. Senior Medical Officer"
                                            required
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Job Level</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            value={formData.job_level}
                                            onChange={(e) => handleChange("job_level", e.target.value)}
                                            placeholder="e.g. Mid/Senior Level"
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Vacancy</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            value={formData.vacancy}
                                            onChange={(e) => handleChange("vacancy", e.target.value)}
                                            placeholder="e.g. 02"
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Employment Status</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            value={formData.employment_status}
                                            onChange={(e) => handleChange("employment_status", e.target.value)}
                                            placeholder="e.g. Full-time, Part-time"
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Job Location</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            value={formData.job_location}
                                            onChange={(e) => handleChange("job_location", e.target.value)}
                                            placeholder="e.g. Dhaka, Bangladesh"
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Experience</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            value={formData.experience}
                                            onChange={(e) => handleChange("experience", e.target.value)}
                                            placeholder="e.g. 3-5 Years"
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Salary Range</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            value={formData.salary_range}
                                            onChange={(e) => handleChange("salary_range", e.target.value)}
                                            placeholder="e.g. Negotiable"
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Deadline</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            type="date"
                                            value={formData.deadline}
                                            onChange={(e) => handleChange("deadline", e.target.value)}
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Status</FieldLabel>
                                    <FieldContent>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </FieldContent>
                                </Field>
                            </div>

                            {/* Long Text Areas */}
                            <Field>
                                <FieldLabel>Job Purpose</FieldLabel>
                                <FieldContent>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.purpose}
                                        onChange={(value) => handleChange("purpose", value)}
                                        className="bg-white min-h-[150px]"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>General Job Description</FieldLabel>
                                <FieldContent>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.general_job_description}
                                        onChange={(value) => handleChange("general_job_description", value)}
                                        className="bg-white min-h-[200px]"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Department Specific Job Description</FieldLabel>
                                <FieldContent>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.department_specific_job_description}
                                        onChange={(value) => handleChange("department_specific_job_description", value)}
                                        className="bg-white min-h-[200px]"
                                    />
                                </FieldContent>
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Competencies & Requirements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-5">
                            <Field>
                                <FieldLabel>Training and Development</FieldLabel>
                                <FieldContent>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.training_and_development}
                                        onChange={(value) => handleChange("training_and_development", value)}
                                        className="bg-white min-h-[150px]"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Prevention and Control of Infections</FieldLabel>
                                <FieldContent>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.prevention_and_control_of_infections}
                                        onChange={(value) => handleChange("prevention_and_control_of_infections", value)}
                                        className="bg-white min-h-[150px]"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Basic Competencies</FieldLabel>
                                <FieldContent>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.basic_competencies}
                                        onChange={(value) => handleChange("basic_competencies", value)}
                                        className="bg-white min-h-[150px]"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Behavioral Competencies</FieldLabel>
                                <FieldContent>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.behavioral_competencies}
                                        onChange={(value) => handleChange("behavioral_competencies", value)}
                                        className="bg-white min-h-[150px]"
                                    />
                                </FieldContent>
                            </Field>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/admin/job-posts")}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <Save className="w-4 h-4" />
                            {isEditing ? "Update Job" : "Save Job"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
