import { api } from "./baseApi";

export interface EmployeeDepartment {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  head_employee_id?: number | null;
  head_employee?: {
    id: number;
    full_name: string;
  } | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeDepartmentResponse {
  success: boolean;
  message: string;
  data: EmployeeDepartment;
}

export interface EmployeeDepartmentListResponse {
  success: boolean;
  message: string;
  data: EmployeeDepartment[];
}

export interface CreateDepartmentPayload {
  name: string;
  code?: string | null;
  description?: string | null;
  head_employee_id?: number | null;
  is_active?: boolean;
}

export const employeeDepartmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeDepartments: builder.query<EmployeeDepartmentListResponse, void>({
      query: () => ({
        url: "/employee-departments",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "EmployeeDepartment" as const, id })),
              { type: "EmployeeDepartment", id: "LIST" },
            ]
          : [{ type: "EmployeeDepartment", id: "LIST" }],
    }),
    getEmployeeDepartmentById: builder.query<EmployeeDepartmentResponse, number>({
      query: (id) => ({
        url: `/employee-departments/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "EmployeeDepartment", id }],
    }),
    createEmployeeDepartment: builder.mutation<EmployeeDepartmentResponse, CreateDepartmentPayload>({
      query: (body) => ({
        url: "/employee-departments",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "EmployeeDepartment", id: "LIST" }],
    }),
    updateEmployeeDepartment: builder.mutation<EmployeeDepartmentResponse, { id: number; data: CreateDepartmentPayload }>({
      query: ({ id, data }) => ({
        url: `/employee-departments/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "EmployeeDepartment", id: arg.id },
        { type: "EmployeeDepartment", id: "LIST" },
      ],
    }),
    deleteEmployeeDepartment: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/employee-departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "EmployeeDepartment", id: "LIST" }],
    }),
  }),
});

export const {
  useGetEmployeeDepartmentsQuery,
  useGetEmployeeDepartmentByIdQuery,
  useCreateEmployeeDepartmentMutation,
  useUpdateEmployeeDepartmentMutation,
  useDeleteEmployeeDepartmentMutation,
} = employeeDepartmentApi;
