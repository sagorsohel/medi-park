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

export interface MissionVisionBase {
  id: number;
  title: string;
  paragraph: string;
  image: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface MissionResponse {
  data: MissionVisionBase;
}

export interface VisionResponse {
  data: MissionVisionBase;
}

export interface UpdateMissionVisionPayload {
  title?: string;
  paragraph?: string;
  image?: string | File;
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

    // Mission
    getMission: builder.query<MissionResponse, void>({
      query: () => ({
        url: "/about-us-page-our-mission-sections",
        method: "GET",
      }),
      providesTags: ["AboutMission"],
    }),
    getMissionActive: builder.query<MissionResponse, void>({
      query: () => ({
        url: "/about-us-page-our-mission-sections/active",
        method: "GET",
      }),
      providesTags: ["AboutMission"],
    }),
    updateMission: builder.mutation<
      { message: string; data: MissionVisionBase },
      { id: number; data: UpdateMissionVisionPayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.title !== undefined) formData.append("title", data.title);
        if (data.paragraph !== undefined) formData.append("paragraph", data.paragraph);
        if (data.image !== undefined) formData.append("image", data.image);
        if (data.status !== undefined) formData.append("status", data.status);

        return {
          url: `/about-us-page-our-mission-sections/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["AboutMission"],
    }),

    // Vision
    getVision: builder.query<VisionResponse, void>({
      query: () => ({
        url: "/about-us-page-our-vision-sections",
        method: "GET",
      }),
      providesTags: ["AboutVision"],
    }),
    getVisionActive: builder.query<VisionResponse, void>({
      query: () => ({
        url: "/about-us-page-our-vision-sections/active",
        method: "GET",
      }),
      providesTags: ["AboutVision"],
    }),
    updateVision: builder.mutation<
      { message: string; data: MissionVisionBase },
      { id: number; data: UpdateMissionVisionPayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.title !== undefined) formData.append("title", data.title);
        if (data.paragraph !== undefined) formData.append("paragraph", data.paragraph);
        if (data.image !== undefined) formData.append("image", data.image);
        if (data.status !== undefined) formData.append("status", data.status);

        return {
          url: `/about-us-page-our-vision-sections/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["AboutVision"],
    }),
  }),
});

export const {
  useGetWhoWeAreQuery,
  useGetWhoWeAreActiveQuery,
  useUpdateWhoWeAreMutation,
  useGetMissionQuery,
  useGetMissionActiveQuery,
  useUpdateMissionMutation,
  useGetVisionQuery,
  useGetVisionActiveQuery,
  useUpdateVisionMutation,
} = aboutPageApi;

