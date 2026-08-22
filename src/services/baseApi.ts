import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { tokenManager } from '@/lib/tokenManager'
import { logout } from '@/store/slices/authSlice'
import type { RootState } from '@/store/index'

const baseUrl = 'https://api.mediparkhospital.com/api'
// const baseUrl = 'https://resupply-clamshell-curtain.ngrok-free.dev/api'
// const baseUrl = 'http://192.168.0.8:8000/api' // For local development

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'same-origin',
  prepareHeaders: (headers, { getState }) => {
    const token = tokenManager.getAccessToken() || (getState() as RootState)?.auth?.token

    // Attach Authorization header if token exists, otherwise proceed as public request
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    headers.set('Accept', 'application/json')
    headers.set('ngrok-skip-browser-warning', '69420')

    return headers
  },
})

export const api = createApi({
  reducerPath: 'api',

  baseQuery: async (args, apiObj, extraOptions) => {
    const result = await rawBaseQuery(args, apiObj, extraOptions)

    // Handle 401 status for admin routes to redirect expired sessions
    if (result.error && result.error.status === 401) {
      const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
      if (isAdminRoute) {
        apiObj.dispatch(logout())
        tokenManager.clearTokens()
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login'
        }
      }
    }

    return result
  },

  tagTypes: ['User', 'Admin', 'Size', 'Color', 'Brand', 'Category', 'Product', 'Banner', 'Order', 'Branch', 'Country', 'Unit', 'Customer', 'Subcategory', 'Supplier', 'Expense', 'Purchase', 'Sale', 'Contact', 'Stock', 'ProfitLoss', 'Dashboard', 'AboutWhoWeAre', 'AboutMission', 'AboutVision', 'AboutTransformingHealthcare', 'AboutMRCPPACES', 'AboutPageBanner', 'News', 'NewsPageBanner', 'GalleryPageBanner', 'Gallery', 'ContactPageBanner', 'ContactBranch', 'ContactMessage', 'BlogPageBanner', 'Blog', 'Doctor', 'Director', 'Investor', 'InstallmentRule', 'FutureVenture', 'ShareTransfer', 'CommissionSetting', 'HealthCheckup', 'Equipment', 'HealthCheckupPackage', 'PackagePage', 'RoomRent', 'HomepagePricing', 'CareerPage', 'JobDetail', 'JobApplication', 'VideoLink', 'Heading', "OurValue", "HomepageStats", "Vendor", "EquipmentPage", "Notice", "InvestorFamilyMember", "Employee", "EmployeeDepartment"],
  endpoints: () => ({}),
})
