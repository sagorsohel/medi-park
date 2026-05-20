import { api } from "./baseApi";

export interface HomepageStat {
    id: number;
    title?: string | null;
    short_description?: string | null;
    count: string;
    status?: "active" | "inactive" | null;
    created_at?: string;
    updated_at?: string;
}

export interface HomepageStatsResponse {
    success: boolean;
    message: string;
    data: HomepageStat[];
}

export interface SingleHomepageStatResponse {
    success: boolean;
    message: string;
    data: HomepageStat;
}

export const homepageStatsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getActiveStats: builder.query<HomepageStatsResponse, void>({
            query: () => "/homepage-stats/active",
            providesTags: ["HomepageStats"],
        }),
        getStatsList: builder.query<HomepageStatsResponse & { pagination?: any }, { search?: string } | void>({
            query: (params) => ({
                url: "/homepage-stats",
                params: params || {},
            }),
            providesTags: ["HomepageStats"],
        }),
        getSingleStat: builder.query<SingleHomepageStatResponse, number>({
            query: (id) => `/homepage-stats/${id}`,
            providesTags: (_result, _error, id) => [{ type: "HomepageStats", id }],
        }),
        createStat: builder.mutation<SingleHomepageStatResponse, Partial<HomepageStat>>({
            query: (data) => ({
                url: "/homepage-stats",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["HomepageStats"],
        }),
        updateStat: builder.mutation<SingleHomepageStatResponse, { id: number; data: Partial<HomepageStat> }>({
            query: ({ id, data }) => ({
                url: `/homepage-stats/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => ["HomepageStats", { type: "HomepageStats", id }],
        }),
        toggleStatActive: builder.mutation<SingleHomepageStatResponse, number>({
            query: (id) => ({
                url: `/homepage-stats/${id}/set-active`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, id) => ["HomepageStats", { type: "HomepageStats", id }],
        }),
        deleteStat: builder.mutation<any, number>({
            query: (id) => ({
                url: `/homepage-stats/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["HomepageStats"],
        }),
    }),
});

export const {
    useGetActiveStatsQuery,
    useGetStatsListQuery,
    useGetSingleStatQuery,
    useCreateStatMutation,
    useUpdateStatMutation,
    useToggleStatActiveMutation,
    useDeleteStatMutation,
} = homepageStatsApi;
