import { api } from "./baseApi";

export interface Notice {
  id: number;
  title: string;
  content: string;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface NoticeResponse {
  success: boolean;
  message: string;
  data: Notice;
}

export interface NoticeListResponse {
  success: boolean;
  message: string;
  data: Notice[];
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

export const noticeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotices: builder.query<NoticeListResponse, number | void>({
      query: (page = 1) => ({
        url: `/notices?page=${page}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Notice" as const, id })),
              { type: "Notice", id: "LIST" },
            ]
          : [{ type: "Notice", id: "LIST" }],
    }),
    getNoticeById: builder.query<NoticeResponse, number>({
      query: (id) => `/notices/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Notice", id }],
    }),
    createNotice: builder.mutation<NoticeResponse, Omit<Notice, "id">>({
      query: (data) => ({
        url: "/notices",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Notice", id: "LIST" }],
    }),
    updateNotice: builder.mutation<NoticeResponse, { id: number; data: Partial<Omit<Notice, "id">> }>({
      query: ({ id, data }) => ({
        url: `/notices/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Notice", id },
        { type: "Notice", id: "LIST" },
      ],
    }),
    deleteNotice: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/notices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Notice", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNoticesQuery,
  useGetNoticeByIdQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = noticeApi;
