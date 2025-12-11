import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { tokenManager } from '@/lib/tokenManager'
import { logout } from '@/store/slices/authSlice'
import type { RootState } from '@/store/index'

const baseUrl = 'https://medipark.mahnoors.shop/public/api'
// const baseUrl = 'http://192.168.0.8:8000/api' // For local development

// Common headers for JSON requests
const getCommonHeaders = (token: string | null, isFormData = false) => {
  const headers = new Headers({
    'Accept': 'application/json',
  })

  if (!isFormData) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return headers
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'same-origin',
  prepareHeaders: (headers, { getState }) => {
    const token = tokenManager.getAccessToken() || (getState() as RootState).auth.token

    if (!token) {
      console.warn('[api.baseQuery] No auth token found')
    }

    // RTK Query headers object does not know if payload is FormData, so we skip Content-Type
    // The actual check is done in baseQuery below
    return headers
  },
})

const PUBLIC_PATHS = [
  '/public/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/admin/login',
  '/user/login',
  '/user/register',
  '/user/send-otp',
  '/user/verify-otp',
  '/user/reset-password',
]

export const api = createApi({
  reducerPath: 'api',

  baseQuery: async (args, apiObj, extraOptions) => {
    const token = tokenManager.getAccessToken()
    // Allow login endpoints and public endpoints without token
    const isLoginEndpoint = apiObj.endpoint === 'adminLogin' || apiObj.endpoint === 'userLogin' || apiObj.endpoint === 'login'
    const isPublicEndpoint = typeof args === 'object' && args !== null && 
      typeof args.url === 'string' && PUBLIC_PATHS.some((path) => args.url.includes(path))
    
    if (!token && !isLoginEndpoint && !isPublicEndpoint) {
      // Only redirect if it's an admin route, not public website routes
      const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
      if (isAdminRoute) {
        console.warn('[api.baseQuery] Request blocked - no token:', apiObj.endpoint)
        apiObj.dispatch(logout())
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login'
        }
        return { error: { status: 401, data: 'No auth token' } }
      }
      // For public routes, just return error without redirect
      return { error: { status: 401, data: 'No auth token' } }
    }

    // Adjust headers for FormData
    if (typeof args === 'object' && args !== null && args.body instanceof FormData) {
      // Don't set Content-Type for FormData
      const headers = getCommonHeaders(token, true)
      const newArgs = { ...args, headers }
      return await rawBaseQuery(newArgs, apiObj, extraOptions)
    }

    // Otherwise, normal JSON request
    const headers = getCommonHeaders(token)
    if (typeof args === 'object' && args !== null) {
      args = { ...args, headers }
    }

    return await rawBaseQuery(args, apiObj, extraOptions)
  },

  tagTypes: ['User', 'Admin', 'Size', 'Color', 'Brand', 'Category', 'Product', 'Banner', 'Order', 'Branch', 'Country', 'Unit', 'Customer', 'Subcategory', 'Supplier', 'Expense', 'Purchase', 'Sale', 'Contact', 'Stock', 'ProfitLoss', 'Dashboard', 'AboutWhoWeAre', 'AboutMission', 'AboutVision', 'AboutTransformingHealthcare', 'AboutMRCPPACES', 'AboutPageBanner', 'News', 'GalleryPageBanner', 'Gallery', 'ContactPageBanner', 'ContactBranch', 'ContactMessage', 'BlogPageBanner', 'Blog'],
  endpoints: () => ({}),
})
