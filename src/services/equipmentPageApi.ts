import { api } from "./baseApi";

export interface EquipmentPage {
  id: number;
  title: string;
  status: "active" | "inactive";
  purchase_no: string;
  equipment_id?: number | null;
  vendor_id: number;
  purchase_date: string;
  quantity: number;
  unit_price: number;
  warranty_expiry_date?: string | null;
  serial_number?: string | null;
  notes?: string | null;
  is_active: number | boolean;
  created_at?: string;
  updated_at?: string;
  equipment?: {
    id: number;
    name: string;
  };
  vendor?: {
    id: number;
    company_name: string;
  };
}

export interface EquipmentPageResponse {
  success: boolean;
  message: string;
  data: EquipmentPage;
}

export interface EquipmentPageListResponse {
  success: boolean;
  message: string;
  data: EquipmentPage[];
  pagination?: {
    per_page: number;
    total_count: number;
    total_page: number;
    current_page: number;
    current_page_count?: number;
    next_page?: number | null;
    previous_page?: number | null;
  };
}

export interface EquipmentPageQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
}

export const equipmentPageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEquipmentPages: builder.query<EquipmentPageListResponse, EquipmentPageQueryParams | number | void>({
      query: (params) => {
        if (typeof params === "number") {
          return { url: `/equipment-pages?page=${params}` };
        }
        return {
          url: "/equipment-pages",
          params: params || {},
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "EquipmentPage" as const, id })),
              { type: "EquipmentPage", id: "LIST" },
            ]
          : [{ type: "EquipmentPage", id: "LIST" }],
    }),
    getEquipmentPage: builder.query<EquipmentPageResponse, number>({
      query: (id) => `/equipment-pages/${id}`,
      providesTags: (_result, _error, id) => [{ type: "EquipmentPage", id }],
    }),
    createEquipmentPage: builder.mutation<EquipmentPageResponse, Omit<EquipmentPage, "id" | "is_active">>({
      query: (data) => ({
        url: "/equipment-pages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "EquipmentPage", id: "LIST" }],
    }),
    updateEquipmentPage: builder.mutation<
      EquipmentPageResponse,
      { id: number; data: Partial<Omit<EquipmentPage, "id" | "is_active">> }
    >({
      query: ({ id, data }) => ({
        url: `/equipment-pages/${id}`,
        method: "POST", // Post is typically allowed or patch.
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "EquipmentPage", id },
        { type: "EquipmentPage", id: "LIST" },
      ],
    }),
    deleteEquipmentPage: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/equipment-pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "EquipmentPage", id: "LIST" }],
    }),
    toggleEquipmentPageActive: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/equipment-pages/${id}/set-active`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "EquipmentPage", id },
        { type: "EquipmentPage", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEquipmentPagesQuery,
  useGetEquipmentPageQuery,
  useCreateEquipmentPageMutation,
  useUpdateEquipmentPageMutation,
  useDeleteEquipmentPageMutation,
  useToggleEquipmentPageActiveMutation,
} = equipmentPageApi;
