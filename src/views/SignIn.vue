<template>
  <div class="container mt-5">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleSignIn" class="mt-3">
      <div class="mb-3">
        <label>Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>Contraseña</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <button class="btn btn-primary w-100" type="submit">Entrar</button>
    </form>

    <a href="/signup" class="btn btn-link mt-3">¿No tienes cuenta? Registrate</a>
    <button class="btn btn-link mt-3" @click="handleResetPassword">
      ¿Olvidaste tu contraseña?
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/services/supabase'
import router from '@/router'

const email = ref('')
const password = ref('')

const handleSignIn = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) {
    alert('Error: ' + error.message)
  } else {
    alert('Sesión iniciada!')
    router.push('/')
  }
}

const handleResetPassword = async () => {
  if (!email.value) {
    alert('Primero ingresa tu email')
    return
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: '/reset-password',
  })
  if (error) alert(error.message)
  else alert('Revisa tu correo para resetear tu contraseña')
}
</script>
