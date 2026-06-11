import { api } from "./baseApi";

export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  date_of_joining: string;
  designation: string;
  salary: string;
  status: string;
  department_id?: number | null;
  department?: {
    id: number;
    title: string;
  } | null;
  address?: string | null;
  profile_image?: string | null;
  raw_profile_image?: string | null;
  resume?: string | null;
  raw_resume?: string | null;
  nid_front_image?: string | null;
  raw_nid_front_image?: string | null;
  nid_back_image?: string | null;
  raw_nid_back_image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeePagination {
  per_page: number;
  total_count: number;
  total_page: number;
  current_page: number;
  current_page_count: number;
  next_page: number | null;
  previous_page: number | null;
}

export interface EmployeesResponse {
  success: boolean;
  message: string;
  pagination: EmployeePagination;
  data: Employee[];
}

export interface SingleEmployeeResponse {
  success: boolean;
  message: string;
  data: Employee;
}

export interface EmployeeQueryParams {
  page?: number | string;
  limit?: number | string;
  search?: string;
}

export const employeeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeesResponse, EmployeeQueryParams | void>({
      query: (arg) => {
        const params: Record<string, string | number> = { page: 1, limit: 15 };
        if (arg && typeof arg === "object") {
          if (arg.page !== undefined) {
            params.page = Number(arg.page) || 1;
          }
          if (arg.limit !== undefined) {
            params.limit = Number(arg.limit) || 15;
          }
          if (arg.search !== undefined) {
            params.search = String(arg.search);
          }
        }
        return {
          url: "/employees",
          method: "GET",
          params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee", id: "LIST" },
            ]
          : [{ type: "Employee", id: "LIST" }],
    }),
    getEmployeeById: builder.query<SingleEmployeeResponse, number | string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Employee", id }],
    }),
    createEmployee: builder.mutation<SingleEmployeeResponse, FormData>({
      query: (formData) => ({
        url: "/employees",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),
    updateEmployee: builder.mutation<SingleEmployeeResponse, { id: number | string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/employees/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Employee", id: arg.id },
        { type: "Employee", id: "LIST" },
      ],
    }),
    deleteEmployee: builder.mutation<{ success: boolean; message: string }, number | string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
