import { api } from "@/services/baseApi";

export interface HealthCheckupPackage {
    id: number;
    package_name: string;
    image: string | null;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface HealthCheckupPackageResponse {
    success: boolean;
    message: string;
    pagination: {
        per_page: number;
        total_count: number;
        total_page: number;
        current_page: number;
        current_page_count: number;
        next_page: number | null;
        previous_page: number | null;
    };
    data: HealthCheckupPackage[];
}

export interface SingleHealthCheckupPackageResponse {
    success: boolean;
    message: string;
    data: HealthCheckupPackage;
}

export interface CreateHealthCheckupPackagePayload {
    package_name: string;
    image: string | File;
    status?: "active" | "inactive";
}

export interface UpdateHealthCheckupPackagePayload {
    package_name?: string;
    image?: string | File;
    status?: "active" | "inactive";
}

export const healthCheckupPackageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getHealthCheckupPackages: builder.query<HealthCheckupPackageResponse, number>({
            query: (page = 1) => ({
                url: `/health-checkup-packages?page=${page}`,
                method: "GET",
            }),
            providesTags: ["HealthCheckupPackage"],
        }),

        getHealthCheckupPackageById: builder.query<SingleHealthCheckupPackageResponse, number>({
            query: (id) => ({
                url: `/health-checkup-packages/${id}`,
                method: "GET",
            }),
            providesTags: ["HealthCheckupPackage"],
            keepUnusedDataFor: 3600,
        }),

        getHealthCheckupPackagesPublic: builder.query<HealthCheckupPackageResponse, number>({
            query: (page = 1) => ({
                url: `/health-checkup-packages?page=${page}&status=active`,
                method: "GET",
            }),
            providesTags: ["HealthCheckupPackage"],
            keepUnusedDataFor: 3600,
        }),

        createHealthCheckupPackage: builder.mutation<
            { success: boolean; message: string; data: HealthCheckupPackage },
            CreateHealthCheckupPackagePayload
        >({
            query: (body) => {
                const formData = new FormData();
                formData.append("package_name", body.package_name);
                if (body.image) {
                    formData.append("image", body.image);
                }
                if (body.status) {
                    formData.append("status", body.status);
                }
                return {
                    url: "/health-checkup-packages",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["HealthCheckupPackage"],
        }),

        updateHealthCheckupPackage: builder.mutation<
            { success: boolean; message: string; data: HealthCheckupPackage },
            { id: number; data: UpdateHealthCheckupPackagePayload }
        >({
            query: ({ id, data: body }) => {
                const formData = new FormData();
                if (body.package_name) {
                    formData.append("package_name", body.package_name);
                }
                if (body.image) {
                    formData.append("image", body.image);
                }
                if (body.status) {
                    formData.append("status", body.status);
                }
                // In blogApi, they use POST for update with FormData for multipart/form-data


                return {
                    url: `/health-checkup-packages/${id}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["HealthCheckupPackage"],
        }),

        deleteHealthCheckupPackage: builder.mutation<
            { success: boolean; message: string },
            number
        >({
            query: (id) => ({
                url: `/health-checkup-packages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["HealthCheckupPackage"],
        }),
    }),
});

export const {
    useGetHealthCheckupPackagesQuery,
    useGetHealthCheckupPackageByIdQuery,
    useGetHealthCheckupPackagesPublicQuery,
    useCreateHealthCheckupPackageMutation,
    useUpdateHealthCheckupPackageMutation,
    useDeleteHealthCheckupPackageMutation,
} = healthCheckupPackageApi;
