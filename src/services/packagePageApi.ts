import { api } from "@/services/baseApi";

export interface PackagePage {
    id: number;
    title: string;
    notice: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface PackagePageResponse {
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
    data: PackagePage[];
}

export interface SinglePackagePageResponse {
    success: boolean;
    message: string;
    data: PackagePage;
}

export interface PackagePagePayload {
    title: string;
    notice: string;
    status?: "active" | "inactive";
}

export const packagePageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPackagePages: builder.query<PackagePageResponse, number>({
            query: (page = 1) => ({
                url: `/package-page?page=${page}`,
                method: "GET",
            }),
            providesTags: ["PackagePage"],
        }),

        getPackagePageById: builder.query<SinglePackagePageResponse, number>({
            query: (id) => ({
                url: `/package-page/${id}`,
                method: "GET",
            }),
            providesTags: ["PackagePage"],
            keepUnusedDataFor: 3600,
        }),

        getPackagePagesPublic: builder.query<PackagePageResponse, number>({
            query: (page = 1) => ({
                url: `/package-page?page=${page}&status=active`,
                method: "GET",
            }),
            providesTags: ["PackagePage"],
            keepUnusedDataFor: 3600,
        }),

        createPackagePage: builder.mutation<
            { success: boolean; message: string; data: PackagePage },
            PackagePagePayload
        >({
            query: (body) => ({
                url: "/package-pages",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PackagePage"],
        }),

        updatePackagePage: builder.mutation<
            { success: boolean; message: string; data: PackagePage },
            { id: number; data: Partial<PackagePagePayload> }
        >({
            query: ({ id, data }) => ({
                url: `/package-page/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["PackagePage"],
        }),

        deletePackagePage: builder.mutation<
            { success: boolean; message: string },
            number
        >({
            query: (id) => ({
                url: `/package-page/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PackagePage"],
        }),
    }),
});

export const {
    useGetPackagePagesQuery,
    useGetPackagePageByIdQuery,
    useGetPackagePagesPublicQuery,
    useCreatePackagePageMutation,
    useUpdatePackagePageMutation,
    useDeletePackagePageMutation,
} = packagePageApi;
