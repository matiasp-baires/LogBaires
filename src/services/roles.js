// src/services/roles.js
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * Lightweight roles helpers usable in templates and scripts.
 * Usage in components:
 * import { useRoles } from '@/services/roles'
 * const { roles, hasRole, can } = useRoles()
 */
export function useRoles() {
  const auth = useAuthStore()

  const roles = computed(() => auth.roles || [])
  const loading = computed(() => auth.rolesLoading)
  const isGuest = computed(() => !roles.value || roles.value.length === 0)

  function hasRole(role) {
    return auth.hasRole(role)
  }

  function hasAny(capabilities) {
    return auth.hasAny(capabilities)
  }

  /**
   * can - convenience to check multiple roles
   * @param {string|string[]} required - single role or array of roles
   * @param {boolean} requireAll - if true, user must have all roles; otherwise any
   */
  function can(required, requireAll = false) {
    if (!required) return false
    if (typeof required === 'string') return hasRole(required)
    if (!Array.isArray(required)) return false
    if (requireAll) return required.every((r) => auth.roles.includes(r))
    return required.some((r) => auth.roles.includes(r))
  }

  return { roles, loading, hasRole, isGuest, hasAny, can }
}

export default useRoles
