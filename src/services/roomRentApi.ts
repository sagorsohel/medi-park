import { api } from "@/services/baseApi";

export interface RoomRent {
    id: number;
    bed_name: string;
    charges: string | number;
    status: "active" | "inactive";
    created_at?: string;
    updated_at?: string;
}

export interface RoomRentResponse {
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
    data: RoomRent[];
}

export const roomRentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRoomRents: builder.query<RoomRentResponse, number | void>({
            query: (page = 1) => ({
                url: `/room-rents?page=${page}&limit=10`,
                method: "GET",
            }),
            providesTags: ["RoomRent"],
        }),
        getRoomRentsPublic: builder.query<RoomRentResponse, void>({
            query: () => ({
                url: `/room-rents?status=active&limit=100`,
                method: "GET",
            }),
            providesTags: ["RoomRent"],
            keepUnusedDataFor: 3600,
        }),
        createRoomRents: builder.mutation<any, { room_rents: { bed_name: string; charges: string | number; status: string }[] }>({
            query: (body) => ({
                url: "/room-rents",
                method: "POST",
                body,
            }),
            invalidatesTags: ["RoomRent"],
        }),
        updateRoomRent: builder.mutation<any, { id: number; data: { bed_name?: string; charges?: string | number; status?: string } }>({
            query: ({ id, data }) => ({
                url: `/room-rents/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["RoomRent"],
        }),
        deleteRoomRent: builder.mutation<any, number>({
            query: (id) => ({
                url: `/room-rents/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["RoomRent"],
        }),
    }),
});

export const {
    useGetRoomRentsQuery,
    useGetRoomRentsPublicQuery,
    useCreateRoomRentsMutation,
    useUpdateRoomRentMutation,
    useDeleteRoomRentMutation,
} = roomRentApi;
