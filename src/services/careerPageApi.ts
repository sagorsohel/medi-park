import { api } from "@/services/baseApi";

export interface CareerPageData {
    id: number;
    title: string;
    section1: string;
    card_image: string;
    card_title: string;
    card_subtitle: string;
    card_description: string;
    message_title: string;
    message_description: string;
    after_message_section: string;
    job_section_title: string;
    join_us_section_title: string;
    join_us_section_subtitle: string;
    join_us_section_button: string;
    employee_engagement_title: string;
    employee_engagement_button: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface CareerPageResponse {
    data: CareerPageData[];
}

export interface UpdateCareerPagePayload {
    title?: string;
    section1?: string;
    card_image?: string | File;
    card_title?: string;
    card_subtitle?: string;
    card_description?: string;
    message_title?: string;
    message_description?: string;
    after_message_section?: string;
    job_section_title?: string;
    join_us_section_title?: string;
    join_us_section_subtitle?: string;
    join_us_section_button?: string;
    employee_engagement_title?: string;
    employee_engagement_button?: string;
    status?: "active" | "inactive";
}

export const careerPageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCareerPages: builder.query<CareerPageResponse, void>({
            query: () => ({
                url: "/career-pages",
                method: "GET",
            }),
            providesTags: ["CareerPage" as any],
        }),
        createCareerPage: builder.mutation<
            { message: string; data: CareerPageData },
            UpdateCareerPagePayload
        >({
            query: (data) => {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: `/career-pages`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["CareerPage" as any],
        }),
        updateCareerPage: builder.mutation<
            { message: string; data: CareerPageData },
            { id: number; data: UpdateCareerPagePayload }
        >({
            query: ({ id, data }) => {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined) {
                        formData.append(key, value as string | Blob);
                    }
                });

                // Appending _method PUT might be necessary for Laravel depending on setup,
                // but looking at aboutPageApi.ts they just use POST to /resource/{id} 
                // without _method. Sticking to that pattern.
                return {
                    url: `/career-pages/${id}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["CareerPage" as any],
        }),
    }),
});

export const {
    useGetCareerPagesQuery,
    useCreateCareerPageMutation,
    useUpdateCareerPageMutation,
} = careerPageApi;
