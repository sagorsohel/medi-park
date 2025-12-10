import { api } from '@/services/baseApi'

export interface HeroSection {
  id: number
  title: string
  subtitle: string
  background_image: string
  opacity: string
  serial: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface HeroSectionResponse {
  data: HeroSection[]
}

export interface CreateHeroSectionPayload {
  title: string
  subtitle: string
  background_image: string | File
  opacity: string
  serial: string
  status?: 'active' | 'inactive'
}

export interface UpdateHeroSectionPayload {
  title?: string
  subtitle?: string
  background_image?: string | File
  opacity?: string
  serial?: string
  status?: 'active' | 'inactive'
}

export interface AboutUsSection {
  id: number
  title: string
  sub_title: string
  content: string
  image_1: string
  image_2: string
  image_3: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface AboutUsResponse {
  success: boolean
  message: string
  data: AboutUsSection
}

export interface UpdateAboutUsSectionPayload {
  title?: string
  sub_title?: string
  content?: string
  image_1?: string | File
  image_2?: string | File
  image_3?: string | File
  status?: 'active' | 'inactive'
}

export interface AboutUsBannerSection {
  id: number
  background_image: string
  opacity: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Facility {
  id: number
  title: string
  short_description: string
  image: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface FacilitiesResponse {
  success: boolean
  message: string
  pagination: {
    per_page: number
    total_count: number
    total_page: number
    current_page: number
    current_page_count: number
    next_page: number | null
    previous_page: number | null
  }
  data: Facility[]
}

export interface CreateFacilityPayload {
  title: string
  short_description: string
  image: string | File
  status?: 'active' | 'inactive'
}

export interface UpdateFacilityPayload {
  title?: string
  short_description?: string
  image?: string | File
  status?: 'active' | 'inactive'
}

export interface CTASection {
  id: number
  title: string
  sub_title: string
  content: string
  button_text: string
  button_link: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface CTASectionResponse {
  success: boolean
  message: string
  data: CTASection
}

export interface UpdateCTASectionPayload {
  title?: string
  sub_title?: string
  content?: string
  button_text?: string
  button_link?: string
  status?: 'active' | 'inactive'
}

export const homepageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all hero sections
    getHeroSections: builder.query<HeroSectionResponse, void>({
      query: () => ({
        url: '/homepage-hero-sections',
        method: 'GET',
      }),
      providesTags: ['Banner'],
    }),
    getHeroSectionsPublic: builder.query<HeroSectionResponse, void>({
      query: () => ({
        url: '/homepage-hero-sections/active',
        method: 'GET',
      }),
      providesTags: ['Banner'],
      keepUnusedDataFor: 3600, // Cache for 60 minutes (3600 seconds)
    }),

    // Create new hero section
    createHeroSection: builder.mutation<
      { message: string; data: HeroSection },
      CreateHeroSectionPayload
    >({
      query: (body) => {
        const formData = new FormData()
        formData.append('title', body.title)
        formData.append('subtitle', body.subtitle)
        formData.append('background_image', body.background_image)
        formData.append('opacity', body.opacity)
        formData.append('serial', body.serial)
        if (body.status) {
          formData.append('status', body.status)
        }
        return {
          url: '/homepage-hero-sections',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Banner'],
    }),

    // Update hero section
    updateHeroSection: builder.mutation<
      { message: string; data: HeroSection },
      { id: number; data: UpdateHeroSectionPayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData()
        if (data.title !== undefined) formData.append('title', data.title)
        if (data.subtitle !== undefined) formData.append('subtitle', data.subtitle)
        if (data.background_image !== undefined) {
          // Handle both File and string
          if (data.background_image instanceof File) {
            formData.append('background_image', data.background_image)
          } else {
            formData.append('background_image', data.background_image)
          }
        }
        if (data.opacity !== undefined) formData.append('opacity', data.opacity)
        if (data.serial !== undefined) formData.append('serial', data.serial)
        if (data.status !== undefined) formData.append('status', data.status)
        return {
          url: `/homepage-hero-sections/${id}`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Banner'],
    }),

    // Delete hero section
    deleteHeroSection: builder.mutation<
      { message: string },
      number
    >({
      query: (id) => ({
        url: `/homepage-hero-sections/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner'],
    }),

    // Set active/inactive status
    setHeroSectionActive: builder.mutation<
      { message: string; data: HeroSection },
      { id: number; status: 'active' | 'inactive' }
    >({
      query: ({ id, status }) => {
        const formData = new FormData()
        formData.append('status', status)
        return {
          url: `/homepage-hero-sections/${id}/set-active`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Banner'],
    }),

    // Reorder hero sections (update serial numbers)
    reorderHeroSections: builder.mutation<
      { message: string },
      { id: number; serial: string }[]
    >({
      query: (body) => ({
        url: '/homepage-hero-sections/reorder',
        method: 'POST',
        body: { sections: body },
      }),
      invalidatesTags: ['Banner'],
    }),

    // About Us Sections
    getAboutUsSection: builder.query<
      AboutUsResponse,
      void
    >({
      query: () => ({
        url: '/homepage-about-us-sections',
        method: 'GET',
      }),
      providesTags: ['Banner'],
      transformResponse: (response: AboutUsResponse | { data: AboutUsSection[] }) => {
        // Handle case where API returns array instead of single object
        if (Array.isArray(response.data)) {
           return { ...response, data: response.data[0] } as AboutUsResponse;
        }
        return response as AboutUsResponse;
      }
    }),

    getAboutUsSectionPublic: builder.query<
      AboutUsResponse,
      void
    >({
      query: () => ({
        url: '/homepage-about-us-sections/active',
        method: 'GET',
      }),
      providesTags: ['Banner'],
      keepUnusedDataFor: 3600, // Cache for 60 minutes (3600 seconds)
      transformResponse: (response: AboutUsResponse | { data: AboutUsSection[] }) => {
        // Handle case where API returns array instead of single object
        if (Array.isArray(response.data)) {
           return { ...response, data: response.data[0] } as AboutUsResponse;
        }
        return response as AboutUsResponse;
      }
    }),

    updateAboutUsSection: builder.mutation<
      AboutUsResponse,
      { id: number; data: UpdateAboutUsSectionPayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData()
        if (data.title !== undefined) formData.append('title', data.title)
        if (data.sub_title !== undefined) formData.append('sub_title', data.sub_title)
        if (data.content !== undefined) formData.append('content', data.content)
        if (data.image_1 !== undefined) {
          if (data.image_1 instanceof File) {
            formData.append('image_1', data.image_1)
          } else {
            formData.append('image_1', data.image_1)
          }
        }
        if (data.image_2 !== undefined) {
          if (data.image_2 instanceof File) {
            formData.append('image_2', data.image_2)
          } else {
            formData.append('image_2', data.image_2)
          }
        }
        if (data.image_3 !== undefined) {
          if (data.image_3 instanceof File) {
            formData.append('image_3', data.image_3)
          } else {
            formData.append('image_3', data.image_3)
          }
        }
        if (data.status !== undefined) formData.append('status', data.status)
        return {
          url: `/homepage-about-us-sections/${id}`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Banner'],
    }),

    getAboutUsBanner: builder.query<
      { data: AboutUsBannerSection },
      void
    >({
      query: () => ({
        url: '/about-us-page-banner-sections',
        method: 'GET',
      }),
      providesTags: ['Banner'],
      transformResponse: (response: { data: AboutUsBannerSection } | { data: AboutUsBannerSection[] }) => {
          if (Array.isArray(response.data)) {
             return { ...response, data: response.data[0] };
          }
          return response as { data: AboutUsBannerSection };
      }
    }),

    updateAboutUsBanner: builder.mutation<
      { message: string; data: AboutUsBannerSection },
      { id: number; data: { background_image?: File | string; opacity?: string } }
    >({
      query: ({ id, data }) => {
        const formData = new FormData()
        if (data.background_image !== undefined) {
          if (data.background_image instanceof File) {
            formData.append('background_image', data.background_image)
          } else {
             formData.append('background_image', data.background_image)
          }
        }
        if (data.opacity !== undefined) formData.append('opacity', data.opacity)
        
        return {
          url: `/about-us-page-banner-sections/${id}`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Banner'],
    }),

    // Facilities Management
    getFacilities: builder.query<FacilitiesResponse, number>({
      query: (page = 1) => ({
        url: `/facilities?page=${page}`,
        method: 'GET',
      }),
      providesTags: ['Banner'],
    }),

    getFacilitiesPublic: builder.query<FacilitiesResponse, void>({
      query: () => ({
        url: '/facilities',
        method: 'GET',
      }),
      providesTags: ['Banner'],
      keepUnusedDataFor: 3600, // Cache for 60 minutes (3600 seconds)
    }),

    createFacility: builder.mutation<
      { success: boolean; message: string; data: Facility },
      CreateFacilityPayload
    >({
      query: (body) => {
        const formData = new FormData()
        formData.append('title', body.title)
        formData.append('short_description', body.short_description)
        formData.append('image', body.image)
        if (body.status) {
          formData.append('status', body.status)
        }
        return {
          url: '/facilities',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Banner'],
    }),

    updateFacility: builder.mutation<
      { success: boolean; message: string; data: Facility },
      { id: number; data: UpdateFacilityPayload }
    >({
      query: ({ id, data: body }) => {
        const formData = new FormData()
        if (body.title) {
          formData.append('title', body.title)
        }
        if (body.short_description) {
          formData.append('short_description', body.short_description)
        }
        if (body.image) {
          formData.append('image', body.image)
        }
        if (body.status) {
          formData.append('status', body.status)
        }
        return {
          url: `/facilities/${id}`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Banner'],
    }),

    deleteFacility: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/facilities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner'],
    }),

    // CTA Section Management
    getCTASection: builder.query<CTASectionResponse, void>({
      query: () => ({
        url: '/homepage-cta-sections',
        method: 'GET',
      }),
      providesTags: ['Banner'],
      transformResponse: (response: CTASectionResponse | { data: CTASection[] }) => {
        // Handle case where API returns array instead of single object
        const responseWithArray = response as { data: CTASection[] };
        if (Array.isArray(responseWithArray.data)) {
          return { ...response, data: responseWithArray.data[0] } as CTASectionResponse;
        }
        return response as CTASectionResponse;
      }
    }),

    getCTASectionPublic: builder.query<CTASectionResponse, void>({
      query: () => ({
        url: '/homepage-cta-sections/active',
        method: 'GET',
      }),
      providesTags: ['Banner'],
      keepUnusedDataFor: 3600, // Cache for 60 minutes (3600 seconds)
      transformResponse: (response: CTASectionResponse | { data: CTASection[] }) => {
        // Handle case where API returns array instead of single object
        const responseWithArray = response as { data: CTASection[] };
        if (Array.isArray(responseWithArray.data)) {
          return { ...response, data: responseWithArray.data[0] } as CTASectionResponse;
        }
        return response as CTASectionResponse;
      }
    }),

    updateCTASection: builder.mutation<
      CTASectionResponse,
      { id: number; data: UpdateCTASectionPayload }
    >({
      query: ({ id, data: body }) => {
        const formData = new FormData()
        if (body.title) {
          formData.append('title', body.title)
        }
        if (body.sub_title) {
          formData.append('sub_title', body.sub_title)
        }
        if (body.content) {
          formData.append('content', body.content)
        }
        if (body.button_text) {
          formData.append('button_text', body.button_text)
        }
        if (body.button_link) {
          formData.append('button_link', body.button_link)
        }
        if (body.status) {
          formData.append('status', body.status)
        }
        return {
          url: `/homepage-cta-sections/${id}`,
          method: 'PUT',
          body: formData,
        }
      },
      invalidatesTags: ['Banner'],
    }),
  }),
})

export const {
  useGetHeroSectionsQuery,
  useGetHeroSectionsPublicQuery,
  useCreateHeroSectionMutation,
  useUpdateHeroSectionMutation,
  useDeleteHeroSectionMutation,
  useSetHeroSectionActiveMutation,
  useReorderHeroSectionsMutation,
  useGetAboutUsSectionQuery,
  useGetAboutUsSectionPublicQuery,
  useUpdateAboutUsSectionMutation,
  useGetAboutUsBannerQuery,
  useUpdateAboutUsBannerMutation,
  useGetFacilitiesQuery,
  useGetFacilitiesPublicQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  useGetCTASectionQuery,
  useGetCTASectionPublicQuery,
  useUpdateCTASectionMutation,
} = homepageApi


