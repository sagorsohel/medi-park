import { api } from "@/services/baseApi";

export interface News {
  id: number;
  title: string;
  description: string;
  feature_image: string;
  status: "active" | "inactive";
  author_name: string;
  author_image: string;
  author_designation: string;
  created_at: string;
  updated_at: string;
}

export interface NewsResponse {
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
  data: News[];
}

export interface SingleNewsResponse {
  success: boolean;
  message: string;
  data: News;
}

export interface CreateNewsPayload {
  title: string;
  description: string;
  feature_image: string | File;
  status?: "active" | "inactive";
  author_name: string;
  author_image: string | File;
  author_designation: string;
}

export interface UpdateNewsPayload {
  title?: string;
  description?: string;
  feature_image?: string | File;
  status?: "active" | "inactive";
  author_name?: string;
  author_image?: string | File;
  author_designation?: string;
}

export interface NewsPageBanner {
  id: number;
  background_image: string;
  opacity: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface NewsPageBannerResponse {
  success: boolean;
  message: string;
  data: NewsPageBanner;
}

export interface UpdateNewsPageBannerPayload {
  background_image?: File | string;
  opacity?: string;
  status?: "active" | "inactive";
}

export const newsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all news with pagination
    getNews: builder.query<NewsResponse, number>({
      query: (page = 1) => ({
        url: `/news?page=${page}`,
        method: "GET",
      }),
      providesTags: ["News"],
    }),

    // Get single news by ID
    getNewsById: builder.query<SingleNewsResponse, number>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "GET",
      }),
      providesTags: ["News"],
      keepUnusedDataFor: 3600, // Cache for 60 minutes
    }),

    // Get active news (public)
    getNewsPublic: builder.query<NewsResponse, number>({
      query: (page = 1) => ({
        url: `/news?page=${page}&status=active`,
        method: "GET",
      }),
      providesTags: ["News"],
      keepUnusedDataFor: 3600, // Cache for 60 minutes
    }),

    // Create news
    createNews: builder.mutation<
      { success: boolean; message: string; data: News },
      CreateNewsPayload
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append("title", body.title);
        formData.append("description", body.description);
        formData.append("feature_image", body.feature_image);
        formData.append("author_name", body.author_name);
        formData.append("author_designation", body.author_designation);
        if (body.author_image) {
          formData.append("author_image", body.author_image);
        }
        if (body.status) {
          formData.append("status", body.status);
        }
        return {
          url: "/news",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["News"],
    }),

    // Update news
    updateNews: builder.mutation<
      { success: boolean; message: string; data: News },
      { id: number; data: UpdateNewsPayload }
    >({
      query: ({ id, data: body }) => {
        const formData = new FormData();
        if (body.title) {
          formData.append("title", body.title);
        }
        if (body.description) {
          formData.append("description", body.description);
        }
        if (body.feature_image) {
          formData.append("feature_image", body.feature_image);
        }
        if (body.author_name) {
          formData.append("author_name", body.author_name);
        }
        if (body.author_designation) {
          formData.append("author_designation", body.author_designation);
        }
        if (body.author_image) {
          formData.append("author_image", body.author_image);
        }
        if (body.status) {
          formData.append("status", body.status);
        }
        return {
          url: `/news/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["News"],
    }),

    // Delete news
    deleteNews: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"],
    }),

    // Get news page banner
    getNewsPageBanner: builder.query<NewsPageBannerResponse, void>({
      query: () => ({
        url: "/news-page-banner-sections",
        method: "GET",
      }),
      providesTags: ["NewsPageBanner"],
    }),

    // Update news page banner
    updateNewsPageBanner: builder.mutation<
      NewsPageBannerResponse,
      UpdateNewsPageBannerPayload
    >({
      query: (data) => {
        const formData = new FormData();
        if (data.background_image !== undefined) {
          formData.append("background_image", data.background_image);
        }
        if (data.opacity !== undefined) {
          formData.append("opacity", data.opacity);
        }
        if (data.status !== undefined) {
          formData.append("status", data.status);
        }
        return {
          url: "/news-page-banner-sections",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["NewsPageBanner"],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useGetNewsPublicQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useGetNewsPageBannerQuery,
  useUpdateNewsPageBannerMutation,
} = newsApi;

