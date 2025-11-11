<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">LogApp</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul v-if="user && !isGuest && !loading" class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- Mostrar solo si usuario está logueado Y tiene al menos 1 rol Y ya cargaron los roles -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Stock
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="/almacenes">Almacenes</a></li>
              <li><a class="dropdown-item" href="/stock">Stock</a></li>
              <li><a class="dropdown-item" href="/stock">Movimientos</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item disabled" href="#">Métricas</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/javerim">Nómina</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Hadrajá
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="/hdrj_espacios">Espacios</a></li>
              <li>
                <a class="dropdown-item" href="/hdrj_instituciones">Instituciones</a>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item disabled" href="#">Métricas</a></li>
            </ul>
          </li>
        </ul>

        <!-- Botón dinámico -->
        <div class="d-flex">
          <!-- Si no hay sesión -->
          <router-link v-if="!user" to="/signin" class="btn btn-outline-secondary">
            Iniciar sesión
          </router-link>

          <!-- Si estoy en mi propio perfil -->
          <button v-else-if="isOnOwnProfile" @click="handleLogout" class="btn btn-outline-danger">
            Cerrar sesión
          </button>

          <!-- Si estoy en cualquier otro lado -->
          <router-link v-else :to="`/javer/${dni}`" class="btn btn-outline-primary">
            Ver perfil
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoles } from '@/services/roles'
import { useAuthStore } from '@/stores/auth'

const { loading, hasRole, isGuest, can } = useRoles()
const auth = useAuthStore()

const route = useRoute()
const router = useRouter()
// bind to central auth store so changes are consistent across tabs
const user = computed(() => auth.user)
const dni = ref(null) // dni desde la tabla Javerim

// Fetch dni when auth.user becomes available. Use a watcher instead of adding
// another onAuthStateChange listener here to avoid duplicated listeners and
// potential race conditions when switching tabs.
watch(
  () => auth.user,
  async (newUser) => {
    if (newUser) {
      try {
        const { supabase } = await import('@/services/supabase')
        const { data: javer, error } = await supabase
          .from('Javerim')
          .select('dni')
          .eq('id_auth', newUser.id)
          .single()
        dni.value = javer?.dni || null
      } catch (e) {
        console.error('Error fetching dni:', e)
        dni.value = null
      }
    } else {
      dni.value = null
    }
  },
  { immediate: true },
)

// Saber si estoy en mi propio perfil
const isOnOwnProfile = computed(() => {
  return route.name === 'javer' && String(route.params.dni) === String(dni.value)
})

const handleLogout = async () => {
  const { supabase } = await import('@/services/supabase')
  await supabase.auth.signOut()
  router.push('/signin')
}
</script>
