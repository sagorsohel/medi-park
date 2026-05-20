import { api } from "./baseApi";

export interface Vendor {
  id: number;
  company_name: string;
  company_email?: string | null;
  company_phone?: string | null;
  company_address?: string | null;
  company_image?: string | null;
  raw_company_image?: string | null;
  supply_materials?: string[] | null;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

export interface VendorResponse {
  success: boolean;
  message: string;
  data: Vendor;
}

export interface VendorListResponse {
  success: boolean;
  message: string;
  data: Vendor[];
  pagination?: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface VendorQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const vendorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<VendorListResponse, VendorQueryParams | void>({
      query: (params) => ({
        url: "/vendors",
        params: params || {},
      }),
      providesTags: ["Vendor"],
    }),
    getVendor: builder.query<VendorResponse, number>({
      query: (id) => `/vendors/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Vendor", id }],
    }),
    createVendor: builder.mutation<VendorResponse, FormData>({
      query: (formData) => ({
        url: "/vendors",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Vendor"],
    }),
    updateVendor: builder.mutation<VendorResponse, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/vendors/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => ["Vendor", { type: "Vendor", id }],
    }),
    deleteVendor: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vendor"],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorApi;
