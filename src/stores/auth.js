/* 
====== CÓMO USAR SISTEMA DE ROLES =======

<script setup>
import { useRoles } from '@/services/roles'
const { loading, hasRole, can, ... } = useRoles()

 // otras opciones de const : hasAny, isGuest
</script>

<template>
  <!-- mostrar mientras se carga (opcional) -->
  <div v-if="loading">Cargando permisos...</div>

  <!-- si necesita el role 'admin' -->
  <button v-if="hasRole('admin')">Acción solo admin</button>

  <!-- o si necesita cualquiera de varios roles -->
  <div v-if="can(['manager','admin'])">
    Contenido para manager o admin
  </div>

  <!-- o exigir todos los roles pasados -->
  <div v-if="can(['roleA','roleB'], true)">
    Contenido si tiene roleA y roleB
  </div>
</template>

*/

// src/stores/auth.js (si usas pinia)
import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    roles: [],
    rolesLoading: false,
  }),

  getters: {
    // Getter to always read from localStorage as fallback
    getUserFromStorage: () => {
      const cached = localStorage.getItem('auth_user_state')
      return cached ? JSON.parse(cached) : null
    },
    getRolesFromStorage: () => {
      const cached = localStorage.getItem('cached_roles')
      return cached ? JSON.parse(cached) : []
    },
  },

  actions: {
    // Initialize store - restore from localStorage on load
    initializeFromStorage() {
      const cachedUser = localStorage.getItem('auth_user_state')
      const cachedRoles = localStorage.getItem('cached_roles')

      if (cachedUser) {
        this.user = JSON.parse(cachedUser)
      }
      if (cachedRoles) {
        this.roles = JSON.parse(cachedRoles)
      }
    },

    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      this.user = data.user
      if (this.user) {
        localStorage.setItem('auth_user_state', JSON.stringify(this.user))
      }
    },

    listenToAuth() {
      // Listen to auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        this.user = session?.user || null
        // when auth changes, refresh roles
        if (this.user) {
          // Save user state to localStorage for persistence across tabs
          localStorage.setItem('auth_user_state', JSON.stringify(this.user))
          localStorage.setItem('auth_user_id', this.user.id)
          await this.fetchRoles()
        } else {
          this.roles = []
          localStorage.removeItem('auth_user_state')
          localStorage.removeItem('auth_user_id')
          localStorage.removeItem('cached_roles')
        }
      })

      // Listen to storage changes from other tabs
      window.addEventListener('storage', (event) => {
        if (event.key === 'cached_roles' && event.newValue) {
          // Roles were updated in another tab
          try {
            this.roles = JSON.parse(event.newValue)
            console.log('Roles synchronized from another tab:', this.roles)
          } catch (e) {
            console.error('Failed to parse cached roles:', e)
          }
        }

        if (event.key === 'auth_user_state' && event.newValue) {
          // User was updated in another tab
          try {
            this.user = JSON.parse(event.newValue)
            console.log('User synchronized from another tab')
          } catch (e) {
            console.error('Failed to parse cached user:', e)
          }
        }

        if (event.key === 'auth_user_id') {
          // Generic auth change detected - sync everything
          if (event.newValue) {
            this.initializeFromStorage()
            // Refresh roles in background
            if (this.user) this.fetchRoles()
          } else {
            // Logged out in another tab
            this.user = null
            this.roles = []
            localStorage.removeItem('cached_roles')
          }
        }
      })

      // Listen to visibility changes - when tab regains focus, restore state
      document.addEventListener('visibilitychange', () => {
        if (document.hidden === false) {
          // Tab became visible - restore state from localStorage
          console.log('Tab is now visible - restoring state from localStorage')
          this.initializeFromStorage()
          // Verify and refresh roles from server
          if (this.user) {
            this.fetchRoles()
          }
        }
      })
    },

    /**
     * Fetch roles for the currently signed-in user from the `Javerim` table.
     * Assumes the table has a column `id_auth` (uuid) and `roles` (text[]).
     */
    async fetchRoles() {
      if (!this.user?.id) {
        this.roles = []
        return this.roles
      }
      try {
        this.rolesLoading = true
        const { data, error } = await supabase
          .from('Javerim')
          .select('roles')
          .eq('id_auth', this.user.id)
          .limit(1)

        if (error) throw error
        const rolesRow = data && data.length ? data[0] : null
        // roles stored as array of strings in the database
        this.roles = rolesRow?.roles || []
        // Cache roles in localStorage
        localStorage.setItem('cached_roles', JSON.stringify(this.roles))
        return this.roles
      } catch (err) {
        console.error('fetchRoles error', err)
        // Don't clear roles on error - keep cached version
        const cachedRoles = localStorage.getItem('cached_roles')
        if (cachedRoles) {
          this.roles = JSON.parse(cachedRoles)
        } else {
          this.roles = []
        }
        return this.roles
      } finally {
        this.rolesLoading = false
      }
    },

    hasRole(role) {
      if (!role) return false
      return this.roles.includes(role)
    },

    hasAny(rolesArray) {
      if (!Array.isArray(rolesArray)) return false
      return rolesArray.some((r) => this.roles.includes(r))
    },

    /**
     * Return true when the signed-in user has no roles assigned.
     * This is a simple helper used to detect 'guest' or unprivileged users.
     */
    hasNoRoles() {
      return !this.roles || this.roles.length === 0
    },
  },
})
