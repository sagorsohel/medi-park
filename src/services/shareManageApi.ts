
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
            query: (page = 1) => `/admin/share-transfers/history?page=${page}`,
            providesTags: ["ShareTransfer"],
        }),
        getCommissionSettings: builder.query<CommissionSetting[], void>({
            query: () => `/admin/commission-settings`,
            providesTags: ["CommissionSetting"],
        }),
        updateCommissionSettings: builder.mutation<void, { level: number; percentage: number }>({
            query: (data) => ({
                url: `/admin/commission-settings`,
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
