import { api } from "@/services/baseApi";

export interface InstallmentRule {
  id: number;
  name: string;
  payment_type: string;
  regular_price: string;
  special_discount: string;
  offer_price: string;
  down_payment_amount: string;
  emi_amount: string;
  duration_months: string;
  waiver_frequency_months: string;
  number_of_waivers: string;
  waiver_amount_per_installment: string;
  total_waiver_amount?: string;
  is_limited_time_offer: string | number;
  status: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface InstallmentRulePagination {
  per_page: number;
  total_count: number;
  total_page: number;
  current_page: number;
  current_page_count: number;
  next_page: number | null;
  previous_page: number | null;
}

export interface InstallmentRulesResponse {
  success: boolean;
  message: string;
  pagination: InstallmentRulePagination;
  data: InstallmentRule[];
}

export interface SingleInstallmentRuleResponse {
  success: boolean;
  message: string;
  data: InstallmentRule;
}

export interface CreateInstallmentRulePayload {
  name: string;
  payment_type: string;
  regular_price: string;
  special_discount?: string;
  offer_price: string;
  down_payment_amount: string;
  emi_amount: string;
  duration_months: string;
  waiver_frequency_months: string;
  number_of_waivers: string;
  waiver_amount_per_installment: string;
  total_waiver_amount?: string;
  is_limited_time_offer?: string | number;
  status?: string;
  description?: string;
}

export interface UpdateInstallmentRulePayload {
  name?: string;
  payment_type?: string;
  regular_price?: string;
  special_discount?: string;
  offer_price?: string;
  down_payment_amount?: string;
  emi_amount?: string;
  duration_months?: string;
  waiver_frequency_months?: string;
  number_of_waivers?: string;
  waiver_amount_per_installment?: string;
  total_waiver_amount?: string;
  is_limited_time_offer?: string | number;
  status?: string;
  description?: string;
}

export const installmentRulesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInstallmentRules: builder.query<InstallmentRulesResponse, number | void>({
      query: (page = 1) => ({
        url: `/installment-rules?page=${page}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "InstallmentRule" as const, id })),
              { type: "InstallmentRule", id: "LIST" },
            ]
          : [{ type: "InstallmentRule", id: "LIST" }],
    }),
    getInstallmentRuleById: builder.query<SingleInstallmentRuleResponse, number>({
      query: (id) => ({
        url: `/installment-rules/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "InstallmentRule", id }],
    }),
    createInstallmentRule: builder.mutation<SingleInstallmentRuleResponse, CreateInstallmentRulePayload>({
      query: (data) => ({
        url: "/installment-rules",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "InstallmentRule", id: "LIST" }],
    }),
    updateInstallmentRule: builder.mutation<
      SingleInstallmentRuleResponse,
      { id: number; data: UpdateInstallmentRulePayload }
    >({
      query: ({ id, data }) => ({
        url: `/installment-rules/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "InstallmentRule", id: arg.id },
        { type: "InstallmentRule", id: "LIST" },
      ],
    }),
    deleteInstallmentRule: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/installment-rules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "InstallmentRule", id },
        { type: "InstallmentRule", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetInstallmentRulesQuery,
  useGetInstallmentRuleByIdQuery,
  useCreateInstallmentRuleMutation,
  useUpdateInstallmentRuleMutation,
  useDeleteInstallmentRuleMutation,
} = installmentRulesApi;

