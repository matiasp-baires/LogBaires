<template>
  <div class="container mt-5">
    <h2>Restablecer Contraseña</h2>
    <form @submit.prevent="handleUpdatePassword" class="mt-3">
      <div class="mb-3">
        <label>Nueva Contraseña</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <button class="btn btn-primary w-100" type="submit">Actualizar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

const password = ref('')

const handleUpdatePassword = async () => {
  const { error } = await supabase.auth.updateUser({ password: password.value })
  if (error) {
    alert(error.message)
  } else {
    alert('Contraseña actualizada. Ya puedes iniciar sesión.')
  }
}
</script>
