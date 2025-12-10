import { api } from "@/services/baseApi";

export interface WhoWeAre {
  id: number;
  title: string;
  paragraph: string;
  image_1: string;
  image_2: string;
  image_3: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface WhoWeAreResponse {
  data: WhoWeAre;
}

export interface UpdateWhoWeArePayload {
  title?: string;
  paragraph?: string;
  image_1?: string | File;
  image_2?: string | File;
  image_3?: string | File;
  status?: "active" | "inactive";
}

export const aboutPageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWhoWeAre: builder.query<WhoWeAreResponse, void>({
      query: () => ({
        url: "/about-us-page-who-we-are-sections",
        method: "GET",
      }),
      providesTags: ["AboutWhoWeAre"],
    }),
    getWhoWeAreActive: builder.query<WhoWeAreResponse, void>({
      query: () => ({
        url: "/about-us-page-who-we-are-sections/active",
        method: "GET",
      }),
      providesTags: ["AboutWhoWeAre"],
    }),
    updateWhoWeAre: builder.mutation<
      { message: string; data: WhoWeAre },
      { id: number; data: UpdateWhoWeArePayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.title !== undefined) formData.append("title", data.title);
        if (data.paragraph !== undefined) formData.append("paragraph", data.paragraph);
        if (data.image_1 !== undefined) formData.append("image_1", data.image_1);
        if (data.image_2 !== undefined) formData.append("image_2", data.image_2);
        if (data.image_3 !== undefined) formData.append("image_3", data.image_3);
        if (data.status !== undefined) formData.append("status", data.status);

        return {
          url: `/about-us-page-who-we-are-sections/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["AboutWhoWeAre"],
    }),
  }),
});

export const {
  useGetWhoWeAreQuery,
  useGetWhoWeAreActiveQuery,
  useUpdateWhoWeAreMutation,
} = aboutPageApi;

