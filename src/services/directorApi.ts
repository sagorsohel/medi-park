import { api } from "@/services/baseApi";

export interface Director {
  id: number;
  name: string;
  designation: string;
  photo: string | null;
  special_message: string | null;
  message: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface DirectorPagination {
  per_page: number;
  total_count: number;
  total_page: number;
  current_page: number;
  current_page_count: number;
  next_page: number | null;
  previous_page: number | null;
}

export interface DirectorsResponse {
  success: boolean;
  message: string;
  pagination: DirectorPagination;
  data: Director[];
}

export interface SingleDirectorResponse {
  success: boolean;
  message: string;
  data: Director;
}

export interface CreateDirectorPayload {
  name: string;
  designation: string;
  photo?: File | string | null;
  special_message?: string | null;
  message?: string | null;
  status?: "active" | "inactive";
}

export interface UpdateDirectorPayload {
  name?: string;
  designation?: string;
  photo?: File | string | null;
  special_message?: string | null;
  message?: string | null;
  status?: "active" | "inactive";
}

export const directorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDirectors: builder.query<DirectorsResponse, { page?: number; limit?: number } | void>({
      query: (params) => {
        const page = params && params.page ? params.page : 1;
        const limit = params && params.limit ? params.limit : 10;
        return {
          url: `/directors?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({ type: "Director" as const, id })),
            { type: "Director", id: "LIST" },
          ]
          : [{ type: "Director", id: "LIST" }],
    }),
    getDirectorById: builder.query<SingleDirectorResponse, number>({
      query: (id) => ({
        url: `/directors/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Director", id }],
    }),
    createDirector: builder.mutation<SingleDirectorResponse, CreateDirectorPayload>({
      query: (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("designation", data.designation);
        if (data.photo) {
          formData.append("photo", data.photo);
        }
        if (data.special_message !== undefined && data.special_message !== null) {
          formData.append("special_message", data.special_message);
        }
        if (data.message !== undefined && data.message !== null) {
          formData.append("message", data.message);
        }
        if (data.status) {
          formData.append("status", data.status);
        }

        return {
          url: "/directors",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Director", id: "LIST" }],
    }),
    updateDirector: builder.mutation<
      SingleDirectorResponse,
      { id: number; data: UpdateDirectorPayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.name !== undefined) {
          formData.append("name", data.name);
        }
        if (data.designation !== undefined) {
          formData.append("designation", data.designation);
        }
        if (data.photo) {
          formData.append("photo", data.photo);
        }
        if (data.special_message !== undefined) {
          formData.append("special_message", data.special_message ?? "");
        }
        if (data.message !== undefined) {
          formData.append("message", data.message ?? "");
        }
        if (data.status !== undefined) {
          formData.append("status", data.status);
        }

        return {
          url: `/directors/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Director", id: arg.id },
        { type: "Director", id: "LIST" },
      ],
    }),
    deleteDirector: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/directors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Director", id },
        { type: "Director", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDirectorsQuery,
  useGetDirectorByIdQuery,
  useCreateDirectorMutation,
  useUpdateDirectorMutation,
  useDeleteDirectorMutation,
} = directorApi;

