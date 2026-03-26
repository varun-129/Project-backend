import { create } from 'zustand'
import { authService } from '../services'

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  fetchCurrentUser: async () => {
    try {
      const { data } = await authService.getCurrentUser()
      set({ user: data.data, isAuthenticated: true, loading: false })
    } catch {
      set({ user: null, isAuthenticated: false, loading: false })
    }
  },

  login: async (credentials) => {
    const { data } = await authService.login(credentials)
    set({ user: data.data.user, isAuthenticated: true })
    return data
  },

  logout: async () => {
    await authService.logout()
    set({ user: null, isAuthenticated: false })
  },

  updateUser: (updated) => set({ user: { ...get().user, ...updated } }),
}))

export default useAuthStore
