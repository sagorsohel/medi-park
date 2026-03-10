import { api } from "@/services/baseApi";

export interface HomepagePricing {
    id: number;
    title: string;
    price: number | string;
    duration: string;
    description: string;
    features: string[];
    highlight: boolean | number;
    status: "active" | "inactive";
    created_at?: string;
    updated_at?: string;
}

export interface HomepagePricingResponse {
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
    data: HomepagePricing[];
}

export const homepagePricingApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getHomepagePricings: builder.query<HomepagePricingResponse, number | void>({
            query: (page = 1) => ({
                url: `/homepage-pricings?page=${page}&limit=10`,
                method: "GET",
            }),
            providesTags: ["HomepagePricing"],
        }),
        getHomepagePricingById: builder.query<any, number>({
            query: (id) => ({
                url: `/homepage-pricings/${id}`,
                method: "GET",
            }),
            providesTags: ["HomepagePricing"],
        }),
        createHomepagePricing: builder.mutation<any, Partial<HomepagePricing>>({
            query: (body) => ({
                url: "/homepage-pricings",
                method: "POST",
                body,
            }),
            invalidatesTags: ["HomepagePricing"],
        }),
        updateHomepagePricing: builder.mutation<any, { id: number; data: Partial<HomepagePricing> }>({
            query: ({ id, data }) => ({
                url: `/homepage-pricings/${id}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["HomepagePricing"],
        }),
        deleteHomepagePricing: builder.mutation<any, number>({
            query: (id) => ({
                url: `/homepage-pricings/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["HomepagePricing"],
        }),
    }),
});

export const {
    useGetHomepagePricingsQuery,
    useGetHomepagePricingByIdQuery,
    useCreateHomepagePricingMutation,
    useUpdateHomepagePricingMutation,
    useDeleteHomepagePricingMutation,
} = homepagePricingApi;
