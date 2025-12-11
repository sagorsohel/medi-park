import { api } from "@/services/baseApi";

export interface BlogPageBanner {
  id: number;
  background_image: string;
  opacity: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface BlogPageBannerResponse {
  success: boolean;
  message: string;
  data: BlogPageBanner;
}

export interface UpdateBlogPageBannerPayload {
  background_image?: File | string;
  opacity?: string;
  status?: "active" | "inactive";
}

export const blogPageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBlogPageBanner: builder.query<BlogPageBannerResponse, void>({
      query: () => ({
        url: "/blog-page-banner-sections",
        method: "GET",
      }),
      providesTags: ["BlogPageBanner"],
    }),
    updateBlogPageBanner: builder.mutation<
      BlogPageBannerResponse,
      { id: number; data: UpdateBlogPageBannerPayload }
    >({
      query: ({ id, data }) => {
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
          url: "/blog-page-banner-sections",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["BlogPageBanner"],
    }),
  }),
});

export const {
  useGetBlogPageBannerQuery,
  useUpdateBlogPageBannerMutation,
} = blogPageApi;

