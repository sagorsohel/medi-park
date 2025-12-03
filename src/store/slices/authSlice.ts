import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { tokenManager } from '@/lib/tokenManager'

export interface Role {
  id: number
  name: string
  slug: string
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  suspended_at: string | null
  suspension_reason: string | null
  is_suspended: boolean
  roles: Role[]
  created_at: string
  updated_at: string
}

// Helper function to get role slug from user
export const getUserRoleSlug = (user: User | null): string | null => {
  if (!user || !user.roles || user.roles.length === 0) {
    return null
  }
  return user.roles[0].slug
}

// Helper function to check if user is admin
export const isAdmin = (user: User | null): boolean => {
  const roleSlug = getUserRoleSlug(user)
  return roleSlug === 'admin'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const storedUser = (() => {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    localStorage.removeItem('user')
    return null
  }
})()

const initialState: AuthState = {
  user: storedUser,
  token: tokenManager.getAccessToken(),
  isAuthenticated: !!(storedUser && tokenManager.getAccessToken()),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User | null; token: string }>
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = !!(action.payload.user && action.payload.token)
     
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      } else {
        localStorage.removeItem('user')
      }
      tokenManager.setAccessToken(action.payload.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
      tokenManager.clearTokens()
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
  },
})

export const { setCredentials, logout, updateUser } = authSlice.actions
export default authSlice.reducer

