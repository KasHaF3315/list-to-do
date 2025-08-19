import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { AuthState, User } from '@/types'

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: Partial<User>) => void
  initializeAuth: () => Promise<void>
  checkAuthStatus: () => Promise<boolean>
}

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

// Helper function to remove cookie
const removeCookie = (name: string) => {
  if (typeof window === 'undefined') return

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// Helper function to validate JWT token
const validateToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp > currentTime
  } catch {
    return false
  }
}

// Helper function to get user from token
const getUserFromToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      id: payload.userId,
      name: payload.name || 'User',
      email: payload.email || '',
      createdAt: new Date(payload.iat * 1000)
    }
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true, // Start with loading true to prevent flashing

        initializeAuth: async () => {
          if (typeof window === 'undefined') return

          try {
            const token = localStorage.getItem('auth_token')

            if (token && validateToken(token)) {
              const user = getUserFromToken(token)
              if (user) {
                set({
                  user,
                  token,
                  isAuthenticated: true,
                  isLoading: false
                })
                return
              }
            }

            // Clear invalid token
            localStorage.removeItem('auth_token')
            removeCookie('auth-token')

            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false
            })
          } catch (error) {
            console.error('Auth initialization error:', error)
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false
            })
          }
        },

        checkAuthStatus: async () => {
          const { token } = get()
          if (!token) return false

          try {
            const isValid = validateToken(token)
            if (!isValid) {
              get().logout()
              return false
            }
            return true
          } catch {
            get().logout()
            return false
          }
        },

        login: (user: User, token: string) => {
          // Store token in localStorage and cookie
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token)
            setCookie('auth-token', token, 7)
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        },

        logout: () => {
          // Get current user ID before clearing auth
          const getCurrentUserId = (): string => {
            const token = localStorage.getItem('auth_token');
            if (token) {
              try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.userId || 'anonymous';
              } catch {
                return 'anonymous';
              }
            }
            return 'anonymous';
          };

          const userId = getCurrentUserId();

          // Clear auth token from localStorage and cookies
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
            removeCookie('auth-token')
            // Clear user-specific todo storage
            localStorage.removeItem(`todo-storage-${userId}`)
          }

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })

          // Clear todos when logging out to ensure user isolation
          // Import useTodoStore dynamically to avoid circular dependency
          import('@/store/todoStore').then(({ useTodoStore }) => {
            useTodoStore.getState().clearAllTodos()
          })
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading })
        },

        updateUser: (userData: Partial<User>) => {
          const currentUser = get().user
          if (currentUser) {
            set({
              user: { ...currentUser, ...userData },
            })
          }
        },
      }),
      {
        name: 'auth-storage',
        storage: typeof window !== 'undefined'
          ? createJSONStorage(() => sessionStorage)
          : undefined,
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          // Don't persist loading state
        })
      }
    )
  )
)

export default useAuthStore
