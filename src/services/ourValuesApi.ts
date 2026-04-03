import { api } from "@/services/baseApi";

export interface OurValue {
  id: number;
  title: string;
  icon?: string;
  short_description?: string;
  long_description?: string;
  status: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export interface OurValueResponse {
  success: boolean;
  message: string;
  data: OurValue[];
}

export interface SingleOurValueResponse {
  success: boolean;
  message: string;
  data: OurValue;
}

export interface CreateOurValuePayload {
  title: string;
  icon?: string;
  short_description?: string;
  long_description?: string;
  status?: boolean | number;
}

export interface UpdateOurValuePayload {
  title?: string;
  icon?: string;
  short_description?: string;
  long_description?: string;
  status?: boolean | number;
}

export const ourValuesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOurValues: builder.query<OurValueResponse, void>({
      query: () => ({
        url: "/our-values",
        method: "GET",
      }),
      providesTags: ["OurValue"],
    }),
    getOurValuesPublic: builder.query<OurValueResponse, void>({
      query: () => ({
        url: "/our-values/active",
        method: "GET",
      }),
      providesTags: ["OurValue"],
    }),
    createOurValue: builder.mutation<SingleOurValueResponse, CreateOurValuePayload>({
      query: (body) => ({
        url: "/our-values",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OurValue"],
    }),
    updateOurValue: builder.mutation<SingleOurValueResponse, { id: number; data: UpdateOurValuePayload }>({
      query: ({ id, data }) => ({
        url: `/our-values/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["OurValue"],
    }),
    deleteOurValue: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/our-values/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OurValue"],
    }),
    setOurValueActive: builder.mutation<SingleOurValueResponse, { id: number; status: boolean | number }>({
      query: ({ id, status }) => ({
        url: `/our-values/${id}/set-active`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["OurValue"],
    }),
  }),
});

export const {
  useGetOurValuesQuery,
  useGetOurValuesPublicQuery,
  useCreateOurValueMutation,
  useUpdateOurValueMutation,
  useDeleteOurValueMutation,
  useSetOurValueActiveMutation,
} = ourValuesApi;
