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
  actions: {
    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      this.user = data.user
    },
    listenToAuth() {
      supabase.auth.onAuthStateChange(async (event, session) => {
        this.user = session?.user || null
        // when auth changes, refresh roles
        if (this.user) await this.fetchRoles()
        else {
          this.roles = []
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
        return this.roles
      } catch (err) {
        console.error('fetchRoles error', err)
        this.roles = []
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
