import { api } from "@/services/baseApi";

export interface VideoLink {
    id: number;
    title: string;
    description: string;
    video: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface VideoLinkResponse {
    success: boolean;
    message: string;
    data: VideoLink;
}

export interface UpdateVideoLinkPayload {
    title?: string;
    description?: string;
    video?: string;
    status?: "active" | "inactive";
}

export const videoLinkApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getVideoLink: builder.query<VideoLinkResponse, void>({
            query: () => ({
                url: "/video-links",
                method: "GET",
            }),
            providesTags: ["VideoLink" as any],
        }),
        updateVideoLink: builder.mutation<VideoLinkResponse, UpdateVideoLinkPayload>({
            query: (data) => ({
                url: "/video-links",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["VideoLink" as any],
        }),
    }),
});

export const {
    useGetVideoLinkQuery,
    useUpdateVideoLinkMutation,
} = videoLinkApi;
