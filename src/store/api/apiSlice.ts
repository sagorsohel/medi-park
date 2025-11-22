import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'
import type { User } from '../slices/authSlice'

// Demo data for authentication
interface DemoUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  password: string
}

const DEMO_USERS: Record<string, DemoUser> = {
  'admin@gmail.com': {
    id: '1',
    email: 'admin@gmail.com',
    name: 'Admin User',
    role: 'admin',
    password: '123456',
  },
  'user@gmail.com': {
    id: '2',
    email: 'user@gmail.com',
    name: 'Regular User',
    role: 'user',
    password: '123456',
  },
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState
      const token = state.auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<
      { user: User; token: string },
      { email: string; password: string }
    >({
      queryFn: async ({ email, password }) => {
        await delay(500) // Simulate network delay
        
        const user = DEMO_USERS[email]
        
        if (!user || user.password !== password) {
          return {
            error: {
              status: 401,
              data: { message: 'Invalid email or password' },
            },
          }
        }

        const token = `demo_token_${user.id}_${Date.now()}`
        
        return {
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
            token,
          },
        }
      },
    }),

    // Registration endpoint
    register: builder.mutation<
      { user: User; token: string },
      { email: string; password: string; name: string }
    >({
      queryFn: async ({ email, password, name }) => {
        await delay(500)
        
        if (DEMO_USERS[email]) {
          return {
            error: {
              status: 400,
              data: { message: 'User already exists' },
            },
          }
        }

        const newUser = {
          id: Date.now().toString(),
          email,
          name,
          role: 'user' as const,
          password,
        }

        // In a real app, this would be saved to a database
        // For demo, we'll just simulate success
        const token = `demo_token_${newUser.id}_${Date.now()}`

        return {
          data: {
            user: {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              role: newUser.role,
            },
            token,
          },
        }
      },
    }),

    // Forgot password - send verification code
    forgotPassword: builder.mutation<
      { message: string; code: string },
      { email: string }
    >({
      queryFn: async ({ email }) => {
        await delay(500)
        
        const user = DEMO_USERS[email]
        
        if (!user) {
          return {
            error: {
              status: 404,
              data: { message: 'User not found' },
            },
          }
        }

        // Generate a 6-digit verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        
        // In a real app, this would be sent via email
        // For demo, we'll return it in the response (console log for testing)
        console.log(`Verification code for ${email}: ${code}`)

        return {
          data: {
            message: 'Verification code sent to your email',
            code, // In production, don't return this
          },
        }
      },
    }),

    // Verify code and reset password
    verifyCodeAndResetPassword: builder.mutation<
      { message: string },
      { email: string; code: string; newPassword: string }
    >({
      queryFn: async ({ email, code, newPassword }) => {
        await delay(500)
        
        const user = DEMO_USERS[email]
        
        if (!user) {
          return {
            error: {
              status: 404,
              data: { message: 'User not found' },
            },
          }
        }

        // In a real app, verify the code from the server
        // For demo, we'll accept any 6-digit code
        if (!/^\d{6}$/.test(code)) {
          return {
            error: {
              status: 400,
              data: { message: 'Invalid verification code format' },
            },
          }
        }

        // In a real app, update password in database
        // For demo, we'll just simulate success
        return {
          data: {
            message: 'Password reset successfully',
          },
        }
      },
    }),

    // Get current user
    getCurrentUser: builder.query<User, void>({
      queryFn: async (_, { getState }) => {
        await delay(300)
        
        const state = getState() as RootState
        const token = state.auth.token
        const user = state.auth.user
        
        if (!token || !user) {
          return {
            error: {
              status: 401,
              data: { message: 'Not authenticated' },
            },
          }
        }

        return {
          data: user,
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyCodeAndResetPasswordMutation,
  useGetCurrentUserQuery,
} = apiSlice

