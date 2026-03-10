import { api } from "@/services/baseApi";

export interface HealthCheckup {
    id: number;
    title: string;
    phone: string;
    room_no: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface HealthCheckupResponse {
    success: boolean;
    message: string;
    pagination?: {
        per_page: number;
        total_count: number;
        total_page: number;
        current_page: number;
    };
    data: HealthCheckup[];
}

export interface SingleHealthCheckupResponse {
    success: boolean;
    message: string;
    data: HealthCheckup;
}

export interface HealthCheckupPayload {
    title: string;
    phone: string;
    room_no: string;
    status?: "active" | "inactive";
}

export const healthCheckupApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getHealthCheckups: builder.query<HealthCheckupResponse, number>({
            query: (page = 1) => ({
                url: `/health-checkup-pages?page=${page}`,
                method: "GET",
            }),
            providesTags: ["HealthCheckup"],
        }),

        getHealthCheckupById: builder.query<SingleHealthCheckupResponse, number>({
            query: (id) => ({
                url: `/health-checkup-pages/${id}`,
                method: "GET",
            }),
            providesTags: ["HealthCheckup"],
        }),

        createHealthCheckup: builder.mutation<
            { success: boolean; message: string; data: HealthCheckup },
            HealthCheckupPayload
        >({
            query: (body) => ({
                url: "/health-checkup-pages",
                method: "POST",
                body,
            }),
            invalidatesTags: ["HealthCheckup"],
        }),

        updateHealthCheckup: builder.mutation<
            { success: boolean; message: string; data: HealthCheckup },
            { id: number; data: Partial<HealthCheckupPayload> }
        >({
            query: ({ id, data }) => ({
                url: `/health-checkup-pages/${id}`,
                method: "POST",
                body: { ...data, _method: "PUT" }, // Common pattern in this project for updates if they use POST + _method
            }),
            invalidatesTags: ["HealthCheckup"],
        }),

        deleteHealthCheckup: builder.mutation<
            { success: boolean; message: string },
            number
        >({
            query: (id) => ({
                url: `/health-checkup-pages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["HealthCheckup"],
        }),
    }),
});

export const {
    useGetHealthCheckupsQuery,
    useGetHealthCheckupByIdQuery,
    useCreateHealthCheckupMutation,
    useUpdateHealthCheckupMutation,
    useDeleteHealthCheckupMutation,
} = healthCheckupApi;
