
import { api } from "./baseApi";

export interface ShareTransfer {
    id: number;
    seller_id: number;
    buyer_id: number;
    quantity: number;
    price_per_share: string;
    total_amount: string;
    status: number;
    created_at: string;
    updated_at: string;
    seller: {
        id: number;
        file_number: string;
        applicant_full_name: string;
        applicant_image: string;
        category_of_share: string;
        total_price: string;
        [key: string]: any;
    };
    buyer: {
        id: number;
        file_number: string;
        applicant_full_name: string;
        applicant_image: string;
        category_of_share: string;
        total_price: string;
        [key: string]: any;
    };
}

export interface ShareTransferHistoryResponse {
    current_page: number;
    data: ShareTransfer[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface CommissionSetting {
    id: number;
    level: number;
    percentage: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const shareManageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getShareTransferHistory: builder.query<ShareTransferHistoryResponse, number | void>({
            query: (page = 1) => `/share-transfers/history?page=${page}`,
            providesTags: ["ShareTransfer"],
        }),
        getCommissionSettings: builder.query<CommissionSetting[], void>({
            query: () => `/commission-settings`,
            transformResponse: (response: any) => {
                // The API might return { success: true, data: { ... } } or just { ... }
                const data = response.data || response;
                
                // If it's already an array, return it
                if (Array.isArray(data)) return data;

                const settings: CommissionSetting[] = [];
                
                // Extract levels from the object: level_1_commission_percentage, level_2_commission_percentage, etc.
                Object.keys(data).forEach(key => {
                    const match = key.match(/^level_(\d+)_commission_percentage$/);
                    if (match) {
                        const level = parseInt(match[1]);
                        settings.push({
                            id: level, // Use level as ID for now since it's a settings object
                            level: level,
                            percentage: String(data[key]),
                            is_active: true,
                            created_at: data.created_at || "",
                            updated_at: data.updated_at || ""
                        });
                    }
                });
                
                return settings.sort((a, b) => a.level - b.level);
            },
            providesTags: ["CommissionSetting"],
        }),
        updateCommissionSettings: builder.mutation<void, { level: number; percentage: number }>({
            query: (data) => ({
                url: `/commission-settings`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CommissionSetting"],
        }),
    }),
});

export const {
    useGetShareTransferHistoryQuery,
    useGetCommissionSettingsQuery,
    useUpdateCommissionSettingsMutation,
} = shareManageApi;
