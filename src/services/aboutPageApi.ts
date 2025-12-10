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

export interface WhoWeAreActiveResponse {
  who_we_are_section: WhoWeAre;
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

export interface MissionActiveResponse {
  our_mission_section: MissionVisionBase;
}

export interface VisionActiveResponse {
  our_vision_section: MissionVisionBase;
}

export interface UpdateMissionVisionPayload {
  title?: string;
  paragraph?: string;
  image?: string | File;
  status?: "active" | "inactive";
}

export interface TransformingHealthcare {
  id: number;
  title: string;
  paragraph: string;
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface TransformingHealthcareResponse {
  data: TransformingHealthcare;
}

export interface TransformingHealthcareActiveResponse {
  after_our_vision_section: TransformingHealthcare;
}

export interface UpdateTransformingHealthcarePayload {
  title?: string;
  paragraph?: string;
  image_1?: string | File;
  image_2?: string | File;
  image_3?: string | File;
  image_4?: string | File;
  status?: "active" | "inactive";
}

export interface MRCPPACES {
  id: number;
  title: string;
  paragraph: string;
  image: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface MRCPPACESResponse {
  data: MRCPPACES;
}

export interface MRCPPACESCreateResponse {
  message: string;
  "2nd_after_our_vision_section": MRCPPACES;
}

export interface UpdateMRCPPACESPayload {
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
    getWhoWeAreActive: builder.query<WhoWeAreActiveResponse, void>({
      query: () => ({
        url: "/about-us-page-who-we-are-sections/active",
        method: "GET",
      }),
      providesTags: ["AboutWhoWeAre"],
      keepUnusedDataFor: 3600, // Cache for 60 minutes (3600 seconds)
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
    getMissionActive: builder.query<MissionActiveResponse, void>({
      query: () => ({
        url: "/about-us-page-our-mission-sections/active",
        method: "GET",
      }),
      providesTags: ["AboutMission"],
      keepUnusedDataFor: 3600, // Cache for 60 minutes (3600 seconds)
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
    getVisionActive: builder.query<VisionActiveResponse, void>({
      query: () => ({
        url: "/about-us-page-our-vision-sections/active",
        method: "GET",
      }),
      providesTags: ["AboutVision"],
      keepUnusedDataFor: 3600, // Cache for 60 minutes (3600 seconds)
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

    // Transforming Healthcare
    getTransformingHealthcare: builder.query<TransformingHealthcareResponse, void>({
      query: () => ({
        url: "/about-us-page-after-our-vision-sections",
        method: "GET",
      }),
      providesTags: ["AboutTransformingHealthcare"],
    }),
    getTransformingHealthcareActive: builder.query<TransformingHealthcareActiveResponse, void>({
      query: () => ({
        url: "/about-us-page-after-our-vision-sections/active",
        method: "GET",
      }),
      providesTags: ["AboutTransformingHealthcare"],
      keepUnusedDataFor: 3600, // Cache for 60 minutes (3600 seconds)
    }),
    updateTransformingHealthcare: builder.mutation<
      { message: string; data: TransformingHealthcare },
      { id: number; data: UpdateTransformingHealthcarePayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.title !== undefined) formData.append("title", data.title);
        if (data.paragraph !== undefined) formData.append("paragraph", data.paragraph);
        if (data.image_1 !== undefined) formData.append("image_1", data.image_1);
        if (data.image_2 !== undefined) formData.append("image_2", data.image_2);
        if (data.image_3 !== undefined) formData.append("image_3", data.image_3);
        if (data.image_4 !== undefined) formData.append("image_4", data.image_4);
        if (data.status !== undefined) formData.append("status", data.status);

        return {
          url: `/about-us-page-after-our-vision-sections/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["AboutTransformingHealthcare"],
    }),

    // MRCP PACES
    getMRCPPACES: builder.query<MRCPPACESResponse, void>({
      query: () => ({
        url: "/about-us-page-2nd-after-our-vision-sections",
        method: "GET",
      }),
      providesTags: ["AboutMRCPPACES"],
    }),
    getMRCPPACESActive: builder.query<MRCPPACESResponse, void>({
      query: () => ({
        url: "/about-us-page-2nd-after-our-vision-sections/active",
        method: "GET",
      }),
      providesTags: ["AboutMRCPPACES"],
    }),
    updateMRCPPACES: builder.mutation<
      { message: string; data: MRCPPACES },
      { id: number; data: UpdateMRCPPACESPayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.title !== undefined) formData.append("title", data.title);
        if (data.paragraph !== undefined) formData.append("paragraph", data.paragraph);
        if (data.image !== undefined) formData.append("image", data.image);
        if (data.status !== undefined) formData.append("status", data.status);

        return {
          url: `/about-us-page-2nd-after-our-vision-sections/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["AboutMRCPPACES"],
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
  useGetTransformingHealthcareQuery,
  useGetTransformingHealthcareActiveQuery,
  useUpdateTransformingHealthcareMutation,
  useGetMRCPPACESQuery,
  useGetMRCPPACESActiveQuery,
  useUpdateMRCPPACESMutation,
} = aboutPageApi;

