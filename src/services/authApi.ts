import { api } from '@/services/baseApi'
import type { User } from '@/store/slices/authSlice'

export interface AuthUser {
  id: number
  name: string
  email: string
  email_verified_at?: string | null
  suspended_at?: string | null
  suspension_reason?: string | null
  is_suspended?: boolean
  roles?: Array<{
    id: number
    name: string
    slug: string
  }>
  created_at?: string
  updated_at?: string
  // Allow backend to add more fields without breaking the UI
  [key: string]: unknown
}

export interface UserProfile {
  id?: number
  name: string
  email: string
  phone?: string | null
  address?: string | null
  dob?: string | null
  gender?: string | null
  profile_image?: string | null
  [key: string]: unknown
}

// Admin Auth API
export const adminAuthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<
      { 
        message: string
        user: User
        token: string
        token_type: string
        expires_in: number
      },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    sendAdminOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: '/admin/send-otp',
        method: 'POST',
        body,
      }),
    }),
    verifyAdminOtp: builder.mutation<{ message: string }, { email: string; otp: string }>({
      query: (body) => ({
        url: '/admin/verify-otp',
        method: 'POST',
        body,
      }),
    }),
    resetAdminPassword: builder.mutation<
      { message: string },
      { email: string; otp: string; password: string; password_confirmation: string }
    >({
      query: (body) => ({
        url: '/admin/reset-password',
        method: 'POST',
        body,
      }),
    }),
    getAdminProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: '/admin/profile',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),
    updateAdminProfile: builder.mutation<{ message: string; user?: UserProfile }, FormData>({
      query: (formData) => ({
        url: '/admin/profile',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
})

// User Auth API
export const userAuthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    userLogin: builder.mutation<
      { 
        message: string
        user: User
        token: string
        token_type: string
        expires_in: number
      },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    registerUser: builder.mutation<
      { 
        message: string
        user: User
        token: string
        token_type: string
        expires_in: number
      },
      { name: string; email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    sendUserOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: '/user/send-otp',
        method: 'POST',
        body,
      }),
    }),
    verifyUserOtp: builder.mutation<{ message: string }, { email: string; otp: string }>({
      query: (body) => ({
        url: '/user/verify-otp',
        method: 'POST',
        body,
      }),
    }),
    resetUserPassword: builder.mutation<
      { message: string },
      { email: string; otp: string; password: string; password_confirmation: string }
    >({
      query: (body) => ({
        url: '/user/reset-password',
        method: 'POST',
        body,
      }),
    }),
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: '/user/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation<{ message: string; user?: UserProfile }, FormData>({
      query: (formData) => ({
        url: '/user/profile',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { 
  useAdminLoginMutation,
  useSendAdminOtpMutation,
  useVerifyAdminOtpMutation,
  useResetAdminPasswordMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
} = adminAuthApi

export const {
  useUserLoginMutation,
  useRegisterUserMutation,
  useSendUserOtpMutation,
  useVerifyUserOtpMutation,
  useResetUserPasswordMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = userAuthApi

// Keep backward compatibility
export const useLoginMutation = useAdminLoginMutation

