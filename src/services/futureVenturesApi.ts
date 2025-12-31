import { api } from "./baseApi";

export interface FutureVenture {
  id: number;
  title: string;
  short_description: string;
  description: string;
  image: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface FutureVenturesResponse {
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
  data: FutureVenture[];
}

export interface SingleFutureVentureResponse {
  success: boolean;
  message: string;
  data: FutureVenture;
}

export interface CreateFutureVenturePayload {
  title: string;
  short_description: string;
  description: string;
  image: File;
  status?: "active" | "inactive";
}

export interface UpdateFutureVenturePayload {
  title?: string;
  short_description?: string;
  description?: string;
  image?: File;
  status?: "active" | "inactive";
}

export const futureVenturesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all future ventures with pagination
    getFutureVentures: builder.query<FutureVenturesResponse, number | void>({
      query: (page = 1) => ({
        url: `/future-ventures?page=${page}`,
        method: "GET",
      }),
      providesTags: ["FutureVenture"],
    }),

    // Get single future venture by ID
    getFutureVentureById: builder.query<SingleFutureVentureResponse, number>({
      query: (id) => ({
        url: `/future-ventures/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{
        type: "FutureVenture",
        id
      }],
    }),

    // Create future venture
    createFutureVenture: builder.mutation<
      { success: boolean; message: string; data: FutureVenture },
      CreateFutureVenturePayload
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append("title", body.title);
        formData.append("short_description", body.short_description);
        formData.append("description", body.description);
        formData.append("image", body.image);
        if (body.status) {
          formData.append("status", body.status);
        }
        return {
          url: "/future-ventures",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["FutureVenture"],
    }),

    // Update future venture
    updateFutureVenture: builder.mutation<
      { success: boolean; message: string; data: FutureVenture },
      { id: number; data: UpdateFutureVenturePayload }
    >({
      query: ({ id, data: body }) => {
        const formData = new FormData();
        if (body.title) {
          formData.append("title", body.title);
        }
        if (body.short_description) {
          formData.append("short_description", body.short_description);
        }
        if (body.description) {
          formData.append("description", body.description);
        }
        if (body.image) {
          formData.append("image", body.image);
        }
        if (body.status) {
          formData.append("status", body.status);
        }
        return {
          url: `/future-ventures/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["FutureVenture"],
    }),

    // Delete future venture
    deleteFutureVenture: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/future-ventures/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FutureVenture"],
    }),
  }),
});

export const {
  useGetFutureVenturesQuery,
  useGetFutureVentureByIdQuery,
  useCreateFutureVentureMutation,
  useUpdateFutureVentureMutation,
  useDeleteFutureVentureMutation,
} = futureVenturesApi;
