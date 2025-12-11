import { api } from "@/services/baseApi";

export interface GalleryItem {
  id: number;
  title: string;
  date: string;
  image: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface GalleryPagination {
  per_page: number;
  total_count: number;
  total_page: number;
  current_page: number;
  current_page_count: number;
  next_page: number | null;
  previous_page: number | null;
}

export interface GalleriesResponse {
  success: boolean;
  message: string;
  pagination: GalleryPagination;
  data: GalleryItem[];
}

export interface CreateUpdateGalleryPayload {
  title: string;
  date: string;
  image?: File | string;
  status?: "active" | "inactive";
}

export const galleryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGalleries: builder.query<GalleriesResponse, number | void>({
      query: (page = 1) => ({
        url: `/galleries?page=${page}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Gallery" as const, id })),
              { type: "Gallery", id: "LIST" },
            ]
          : [{ type: "Gallery", id: "LIST" }],
    }),
    createGallery: builder.mutation<GalleriesResponse, CreateUpdateGalleryPayload>(
      {
        query: (data) => {
          const formData = new FormData();
          formData.append("title", data.title);
          formData.append("date", data.date);
          if (data.image !== undefined) {
            formData.append("image", data.image);
          }
          if (data.status !== undefined) {
            formData.append("status", data.status);
          }

          return {
            url: "/galleries",
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: [{ type: "Gallery", id: "LIST" }],
      }
    ),
    updateGallery: builder.mutation<
      GalleriesResponse,
      { id: number; data: CreateUpdateGalleryPayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("date", data.date);
        if (data.image !== undefined) {
          formData.append("image", data.image);
        }
        if (data.status !== undefined) {
          formData.append("status", data.status);
        }

        return {
          url: `/galleries/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Gallery", id: arg.id },
        { type: "Gallery", id: "LIST" },
      ],
    }),
    deleteGallery: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/galleries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Gallery", id },
        { type: "Gallery", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetGalleriesQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
} = galleryApi;


