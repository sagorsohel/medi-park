import { api } from "@/services/baseApi";

export interface GalleryPageBanner {
  id: number;
  background_image: string;
  opacity: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface GalleryPageBannerResponse {
  success: boolean;
  message: string;
  data: GalleryPageBanner;
}

export interface UpdateGalleryPageBannerPayload {
  background_image?: File | string;
  opacity?: string;
  status?: "active" | "inactive";
}

export const galleryPageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGalleryPageBanner: builder.query<GalleryPageBannerResponse, void>({
      query: () => ({
        url: "/gallery-page-banner-sections",
        method: "GET",
      }),
      providesTags: ["GalleryPageBanner"],
      transformResponse: (
        response:
          | GalleryPageBannerResponse
          | { data: GalleryPageBanner[] }
      ) => {
        if (Array.isArray((response as { data: GalleryPageBanner[] }).data)) {
          return {
            ...(response as { success: boolean; message: string }),
            data: (response as { data: GalleryPageBanner[] }).data[0],
          } as GalleryPageBannerResponse;
        }
        return response as GalleryPageBannerResponse;
      },
    }),
    updateGalleryPageBanner: builder.mutation<
      GalleryPageBannerResponse,
      { id: number; data: UpdateGalleryPageBannerPayload }
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
          url: `/gallery-page-banner-sections/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["GalleryPageBanner"],
    }),
  }),
});

export const {
  useGetGalleryPageBannerQuery,
  useUpdateGalleryPageBannerMutation,
} = galleryPageApi;


