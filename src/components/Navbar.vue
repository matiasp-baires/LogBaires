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
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
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
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Métricas</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/javerim">Nómina</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/presupuestos">Presupuestos</a>
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
              <li><a class="dropdown-item" href="/hdrj_terrenos">Terrenos</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Métricas</a></li>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

const route = useRoute()
const router = useRouter()

const user = ref(null) // objeto de supabase.auth
const dni = ref(null) // dni desde la tabla Javerim

onMounted(async () => {
  // Obtener sesión actual
  const { data } = await supabase.auth.getUser()
  user.value = data.user || null

  if (user.value) {
    // Buscar el dni en tabla Javerim
    const { data: javer, error } = await supabase
      .from('Javerim')
      .select('dni')
      .eq('id_auth', user.value.id) // id de auth.users
      .single()

    if (!error && javer) {
      dni.value = javer.dni
    }
  }

  // Escuchar cambios en sesión
  supabase.auth.onAuthStateChange(async (event, session) => {
    user.value = session?.user || null
    if (user.value) {
      const { data: javer } = await supabase
        .from('Javerim')
        .select('dni')
        .eq('id_auth', user.value.id)
        .single()
      dni.value = javer?.dni || null
    } else {
      dni.value = null
    }
  })
})

// Saber si estoy en mi propio perfil
const isOnOwnProfile = computed(() => {
  return route.name === 'javer' && String(route.params.dni) === String(dni.value)
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/signin')
}
</script>
