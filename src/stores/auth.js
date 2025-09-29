// src/stores/auth.js (si usas pinia)
import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      this.user = data.user
    },
    listenToAuth() {
      supabase.auth.onAuthStateChange((event, session) => {
        this.user = session?.user || null
      })
    },
  },
})
