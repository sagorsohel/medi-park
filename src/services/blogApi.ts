import { api } from "@/services/baseApi";

export interface Blog {
  id: number;
  title: string;
  description: string;
  feature_image: string;
  status: "active" | "inactive";
  author_name: string;
  author_image: string;
  author_designation: string;
  created_at: string;
  updated_at: string;
}

export interface BlogResponse {
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
  data: Blog[];
}

export interface SingleBlogResponse {
  success: boolean;
  message: string;
  data: Blog;
}

export interface CreateBlogPayload {
  title: string;
  description: string;
  feature_image: string | File;
  status?: "active" | "inactive";
  author_name: string;
  author_image: string | File;
  author_designation: string;
}

export interface UpdateBlogPayload {
  title?: string;
  description?: string;
  feature_image?: string | File;
  status?: "active" | "inactive";
  author_name?: string;
  author_image?: string | File;
  author_designation?: string;
}

export const blogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogResponse, number>({
      query: (page = 1) => ({
        url: `/blogs?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    getBlogById: builder.query<SingleBlogResponse, number>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "GET",
      }),
      providesTags: ["Blog"],
      keepUnusedDataFor: 3600,
    }),

    getBlogsPublic: builder.query<BlogResponse, number>({
      query: (page = 1) => ({
        url: `/blogs?page=${page}&status=active`,
        method: "GET",
      }),
      providesTags: ["Blog"],
      keepUnusedDataFor: 3600,
    }),

    createBlog: builder.mutation<
      { success: boolean; message: string; data: Blog },
      CreateBlogPayload
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append("title", body.title);
        formData.append("description", body.description);
        formData.append("feature_image", body.feature_image);
        formData.append("author_name", body.author_name);
        formData.append("author_designation", body.author_designation);
        if (body.author_image) {
          formData.append("author_image", body.author_image);
        }
        if (body.status) {
          formData.append("status", body.status);
        }
        return {
          url: "/blogs",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Blog"],
    }),

    updateBlog: builder.mutation<
      { success: boolean; message: string; data: Blog },
      { id: number; data: UpdateBlogPayload }
    >({
      query: ({ id, data: body }) => {
        const formData = new FormData();
        if (body.title) {
          formData.append("title", body.title);
        }
        if (body.description) {
          formData.append("description", body.description);
        }
        if (body.feature_image) {
          formData.append("feature_image", body.feature_image);
        }
        if (body.author_name) {
          formData.append("author_name", body.author_name);
        }
        if (body.author_designation) {
          formData.append("author_designation", body.author_designation);
        }
        if (body.author_image) {
          formData.append("author_image", body.author_image);
        }
        if (body.status) {
          formData.append("status", body.status);
        }
        return {
          url: `/blogs/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Blog"],
    }),

    deleteBlog: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogsPublicQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;

