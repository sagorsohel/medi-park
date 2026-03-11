import { api } from "@/services/baseApi";

export interface JobDetail {
    id: number;
    job_title: string;
    job_level: string;
    purpose: string;
    general_job_description: string;
    department_specific_job_description: string;
    training_and_development: string;
    prevention_and_control_of_infections: string;
    basic_competencies: string;
    behavioral_competencies: string;
    job_location: string;
    employment_status: string;
    experience: string;
    vacancy: string;
    salary_range: string;
    deadline: string;
    status: "active" | "inactive" | string;
    created_at: string;
    updated_at: string;
}

export interface JobDetailsResponse {
    data: JobDetail[];
    pagination?: {
        per_page: number;
        total_count: number;
        total_page: number;
        current_page: number;
        current_page_count: number;
        next_page: number | null;
        previous_page: number | null;
    };
}

export interface CreateJobDetailPayload {
    job_title: string;
    job_level?: string;
    purpose?: string;
    general_job_description?: string;
    department_specific_job_description?: string;
    training_and_development?: string;
    prevention_and_control_of_infections?: string;
    basic_competencies?: string;
    behavioral_competencies?: string;
    job_location?: string;
    employment_status?: string;
    experience?: string;
    vacancy?: string;
    salary_range?: string;
    deadline?: string;
    status: string;
}

export interface UpdateJobDetailPayload extends Partial<CreateJobDetailPayload> { }

export interface JobApplication {
    id: number;
    job_detail_id: number;
    full_name: string;
    email: string;
    phone: string;
    present_address?: { address: string; district: string };
    permanent_address?: { address: string; district: string };
    cv_url?: string;
    image_url?: string;
    status: string;
    applied_at: string;
    created_at: string;
    updated_at: string;
    job_detail?: JobDetail;
}

export interface JobApplicationsResponse {
    data: JobApplication[];
    pagination?: {
        per_page: number;
        total_count: number;
        total_page: number;
        current_page: number;
        current_page_count: number;
        next_page: number | null;
        previous_page: number | null;
    };
}

export const jobApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getJobDetails: builder.query<JobDetailsResponse, { page?: number; per_page?: number } | void>({
            query: (params) => ({
                url: "/job-details",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["JobDetail" as any],
        }),
        getJobDetailById: builder.query<{ data: JobDetail }, number>({
            query: (id) => ({
                url: `/job-details/${id}`,
                method: "GET",
            }),
            providesTags: ["JobDetail" as any],
        }),
        createJobDetail: builder.mutation<{ message: string; data: JobDetail }, CreateJobDetailPayload>({
            query: (data) => ({
                url: "/job-details",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["JobDetail" as any],
        }),
        updateJobDetail: builder.mutation<{ message: string; data: JobDetail }, { id: number; data: UpdateJobDetailPayload }>({
            query: ({ id, data }) => ({
                url: `/job-details/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["JobDetail" as any],
        }),
        deleteJobDetail: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/job-details/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["JobDetail" as any],
        }),

        // Applications Endpoints
        getJobApplications: builder.query<JobApplicationsResponse, { page?: number; per_page?: number; job_id?: number } | void>({
            query: (params) => ({
                url: "/job-applications",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["JobApplication" as any],
        }),
        deleteJobApplication: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/job-applications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["JobApplication" as any],
        }),
        getJobApplicationById: builder.query<{ data: JobApplication }, number>({
            query: (id) => ({
                url: `/job-applications/${id}`,
                method: "GET",
            }),
            providesTags: ["JobApplication" as any],
        }),
        createJobApplication: builder.mutation<{ message: string }, FormData>({
            query: (data) => ({
                url: "/job-applications",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["JobApplication" as any],
        }),
    }),
});

export const {
    useGetJobDetailsQuery,
    useGetJobDetailByIdQuery,
    useCreateJobDetailMutation,
    useUpdateJobDetailMutation,
    useDeleteJobDetailMutation,
    useGetJobApplicationsQuery,
    useGetJobApplicationByIdQuery,
    useDeleteJobApplicationMutation,
    useCreateJobApplicationMutation,
} = jobApi;
