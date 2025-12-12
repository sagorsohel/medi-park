import { api } from "@/services/baseApi";

export interface ContactPageBanner {
  id: number;
  background_image: string;
  opacity: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface ContactPageBannerResponse {
  success: boolean;
  message: string;
  data: ContactPageBanner;
}

export interface UpdateContactPageBannerPayload {
  background_image?: File | string;
  opacity?: string;
  status?: "active" | "inactive";
}

export interface BranchItem {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface BranchPagination {
  per_page: number;
  total_count: number;
  total_page: number;
  current_page: number;
  current_page_count: number;
  next_page: number | null;
  previous_page: number | null;
}

export interface BranchesResponse {
  success: boolean;
  message: string;
  pagination: BranchPagination;
  data: BranchItem[];
}

export interface CreateUpdateBranchPayload {
  name: string;
  address: string;
  phone: string;
  email: string;
  status?: "active" | "inactive";
}

export interface CreateContactMessagePayload {
  patient_name: string;
  gender: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  message: string;
}

export interface ContactMessage {
  id: number;
  patient_name: string;
  gender: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageResponse {
  success: boolean;
  message: string;
  data?: ContactMessage;
}

export interface ContactMessagesResponse {
  success: boolean;
  message: string;
  pagination: BranchPagination;
  data: ContactMessage[];
}

export interface FooterContact {
  id: number;
  email: string;
  phone: string[];
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface FooterContactResponse {
  success: boolean;
  message: string;
  data: FooterContact;
}

export interface CreateUpdateFooterContactPayload {
  email: string;
  phone: string[];
  status?: "active" | "inactive";
}

export interface SocialLinkItem {
  id: number;
  name: string;
  image: string;
  link: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface SocialLinksResponse {
  success: boolean;
  message: string;
  pagination: BranchPagination;
  data: SocialLinkItem[];
}

export interface CreateUpdateSocialLinkPayload {
  name: string;
  image?: File | string;
  link: string;
  status?: "active" | "inactive";
}

export const contactPageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getContactPageBanner: builder.query<ContactPageBannerResponse, void>({
      query: () => ({
        url: "/contact-page-banner-sections",
        method: "GET",
      }),
      providesTags: ["ContactPageBanner"],
    }),
    updateContactPageBanner: builder.mutation<
      ContactPageBannerResponse,
      { id: number; data: UpdateContactPageBannerPayload }
    >({
      query: ({ id, data }) => {
        console.log(id);
        const formData = new FormData();
        if (data.background_image !== undefined) {
          formData.append("background_image", data.background_image);
        }
        if (data.opacity !== undefined) {
          formData.append("opacity", data.opacity);
        }
        if (data.status !== undefined) {
          formData.append("status", data.status);
        }
        return {
          url: `/contact-page-banner-sections`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ContactPageBanner"],
    }),

    getBranches: builder.query<BranchesResponse, number | void>({
      query: (page = 1) => ({
        url: `/branches?page=${page}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "ContactBranch" as const, id })),
              { type: "ContactBranch", id: "LIST" },
            ]
          : [{ type: "ContactBranch", id: "LIST" }],
    }),
    createBranch: builder.mutation<BranchesResponse, CreateUpdateBranchPayload>({
      query: (data) => ({
        url: "/branches",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "ContactBranch", id: "LIST" }],
    }),
    updateBranch: builder.mutation<
      BranchesResponse,
      { id: number; data: CreateUpdateBranchPayload }
    >({
      query: ({ id, data }) => ({
        url: `/branches/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ContactBranch", id: arg.id },
        { type: "ContactBranch", id: "LIST" },
      ],
    }),
    deleteBranch: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/branches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ContactBranch", id },
        { type: "ContactBranch", id: "LIST" },
      ],
    }),

    getContactMessages: builder.query<ContactMessagesResponse, number | void>({
      query: (page = 1) => ({
        url: `/contacts?page=${page}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "ContactMessage" as const, id })),
              { type: "ContactMessage", id: "LIST" },
            ]
          : [{ type: "ContactMessage", id: "LIST" }],
    }),
    createContactMessage: builder.mutation<ContactMessageResponse, CreateContactMessagePayload>({
      query: (data) => ({
        url: "/contacts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "ContactMessage", id: "LIST" }],
    }),

    getFooterContact: builder.query<FooterContactResponse, void>({
      query: () => ({
        url: "/footer-contact",
        method: "GET",
      }),
      providesTags: ["Contact"],
    }),
    createUpdateFooterContact: builder.mutation<FooterContactResponse, CreateUpdateFooterContactPayload>({
      query: (data) => ({
        url: "/footer-contact",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contact"],
    }),

    getSocialLinks: builder.query<SocialLinksResponse, number | void>({
      query: (page = 1) => ({
        url: `/social-links?page=${page}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Contact" as const, id: `social-${id}` })),
              { type: "Contact", id: "SOCIAL-LINKS-LIST" },
            ]
          : [{ type: "Contact", id: "SOCIAL-LINKS-LIST" }],
    }),
    createSocialLink: builder.mutation<SocialLinksResponse, CreateUpdateSocialLinkPayload>({
      query: (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("link", data.link);
        if (data.image !== undefined) {
          formData.append("image", data.image);
        }
        if (data.status !== undefined) {
          formData.append("status", data.status);
        }
        return {
          url: "/social-links",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Contact", id: "SOCIAL-LINKS-LIST" }],
    }),
    updateSocialLink: builder.mutation<
      SocialLinksResponse,
      { id: number; data: CreateUpdateSocialLinkPayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("link", data.link);
        if (data.image !== undefined) {
          formData.append("image", data.image);
        }
        if (data.status !== undefined) {
          formData.append("status", data.status);
        }
        return {
          url: `/social-links/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Contact", id: `social-${arg.id}` },
        { type: "Contact", id: "SOCIAL-LINKS-LIST" },
      ],
    }),
    deleteSocialLink: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/social-links/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Contact", id: `social-${id}` },
        { type: "Contact", id: "SOCIAL-LINKS-LIST" },
      ],
    }),
  }),
});

export const {
  useGetContactPageBannerQuery,
  useUpdateContactPageBannerMutation,
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useGetContactMessagesQuery,
  useCreateContactMessageMutation,
  useGetFooterContactQuery,
  useCreateUpdateFooterContactMutation,
  useGetSocialLinksQuery,
  useCreateSocialLinkMutation,
  useUpdateSocialLinkMutation,
  useDeleteSocialLinkMutation,
} = contactPageApi;


