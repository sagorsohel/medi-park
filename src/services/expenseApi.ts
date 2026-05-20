import { api } from "./baseApi";

export interface Expense {
  id: number;
  name: string;
  description?: string | null;
  images: string[];
  raw_images?: string[];
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseResponse {
  success: boolean;
  message: string;
  data: Expense;
}

export interface ExpenseListResponse {
  success: boolean;
  message: string;
  data: Expense[];
  pagination?: {
    per_page: number;
    total_count: number;
    total_page: number;
    current_page: number;
    current_page_count?: number;
    next_page?: string | null;
    previous_page?: string | null;
  };
}

export interface ExpenseQueryParams {
  filter?: "today" | "this_week" | "this_month" | "this_year" | string;
  from_date?: string;
  to_date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<ExpenseListResponse, ExpenseQueryParams | void>({
      query: (params) => ({
        url: "/expenses",
        params: params || {},
      }),
      providesTags: ["Expense"],
    }),
    getExpense: builder.query<ExpenseResponse, number>({
      query: (id) => `/expenses/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Expense", id }],
    }),
    createExpense: builder.mutation<ExpenseResponse, FormData>({
      query: (formData) => ({
        url: "/expenses",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Expense"],
    }),
    updateExpense: builder.mutation<ExpenseResponse, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/expenses/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => ["Expense", { type: "Expense", id }],
    }),
    deleteExpense: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense"],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
