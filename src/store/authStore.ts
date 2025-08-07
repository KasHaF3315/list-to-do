import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { AuthState, User } from '@/types'

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        login: (user: User, token: string) => {
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
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
          : undefined
      }
    )
  )
)

export default useAuthStore
