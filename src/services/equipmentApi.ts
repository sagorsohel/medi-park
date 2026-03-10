import { api } from "@/services/baseApi";

export interface EquipmentCategory {
    id: number;
    name: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
    equipments?: Equipment[];
}

export interface Equipment {
    id: number;
    equipment_category_id: number;
    name: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
    equipment_category?: EquipmentCategory;
}

export interface EquipmentCategoryResponse {
    success: boolean;
    message: string;
    data: EquipmentCategory[];
}

export interface EquipmentResponse {
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
    data: Equipment[];
}

export const equipmentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Equipment Categories
        getEquipmentCategories: builder.query<EquipmentCategoryResponse, void>({
            query: () => ({
                url: "/equipment-categories",
                method: "GET",
            }),
            providesTags: ["Equipment"],
        }),
        createEquipmentCategory: builder.mutation<any, { name: string; status: string }>({
            query: (body) => ({
                url: "/equipment-categories",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Equipment"],
        }),
        updateEquipmentCategory: builder.mutation<any, { id: number; data: { name?: string; status?: string } }>({
            query: ({ id, data }) => ({
                url: `/equipment-categories/${id}`,
                method: "POST",
                body: { ...data },
            }),
            invalidatesTags: ["Equipment"],
        }),
        deleteEquipmentCategory: builder.mutation<any, number>({
            query: (id) => ({
                url: `/equipment-categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Equipment"],
        }),

        // Equipment
        getEquipments: builder.query<EquipmentResponse, number | void>({
            query: (page = 1) => ({
                url: `/equipment?page=${page}&per_page=10`,
                method: "GET",
            }),
            providesTags: ["Equipment"],
        }),
        getEquipmentsPublic: builder.query<EquipmentResponse, void>({
            query: () => ({
                url: `/equipment?status=active&per_page=1000`,
                method: "GET",
            }),
            providesTags: ["Equipment"],
            keepUnusedDataFor: 3600,
        }),
        createEquipment: builder.mutation<any, { equipment_category_id: number; equipment: { name: string; status: string }[] }>({
            query: (body) => {
                const formData = new FormData();
                formData.append("equipment_category_id", body.equipment_category_id.toString());
                body.equipment.forEach((item, index) => {
                    formData.append(`equipment[${index}][name]`, item.name);
                    formData.append(`equipment[${index}][status]`, item.status);
                });
                return {
                    url: "/equipment",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Equipment"],
        }),
        updateEquipment: builder.mutation<any, { id: number; data: { equipment_category_id?: number; name?: string; status?: string } }>({
            query: ({ id, data }) => ({
                url: `/equipment/${id}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Equipment"],
        }),
        deleteEquipment: builder.mutation<any, number>({
            query: (id) => ({
                url: `/equipment/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Equipment"],
        }),
    }),
});

export const {
    useGetEquipmentCategoriesQuery,
    useCreateEquipmentCategoryMutation,
    useUpdateEquipmentCategoryMutation,
    useDeleteEquipmentCategoryMutation,
    useGetEquipmentsQuery,
    useGetEquipmentsPublicQuery,
    useCreateEquipmentMutation,
    useUpdateEquipmentMutation,
    useDeleteEquipmentMutation,
} = equipmentApi;
