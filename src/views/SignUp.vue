<template>
  <div class="container mt-5">
    <h2>Registrarse</h2>
    <form @submit.prevent="handleSignUp" class="row mt-3">
      <!-- email + password -->
      <div class="col-md-6 mb-3">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          required
          placeholder="javer.baires@gmail.com"
        />
      </div>
      <div class="col-md-6 mb-3">
        <label>Contraseña</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>

      <!-- DNI -->
      <div class="col-md-6 mb-3">
        <label>DNI</label>
        <input
          v-model="dni"
          type="number"
          max="100000000"
          min="9999999"
          class="form-control"
          required
        />
        <div class="invalid-feedback">Ingresar DNI válido</div>
      </div>

      <!-- Celular con select de país -->
      <div class="col-md-6 mb-3">
        <label>Celular</label>
        <div class="input-group">
          <select v-model="countryCode" class="form-select" style="max-width: 120px">
            <option v-for="c in phoneCountries" :key="c.code" :value="c.code">
              {{ c.emoji }} {{ c.code }}
            </option>
          </select>
          <input
            v-model="rawCelular"
            type="tel"
            minlength="7"
            class="form-control"
            required
            placeholder="1158007..."
          />
        </div>
      </div>

      <!-- Nombre y Apellido -->
      <div class="col-md-6 mb-3">
        <label>Nombre</label>
        <input v-model="nombre" type="text" class="form-control" required />
      </div>
      <div class="col-md-6 mb-3">
        <label>Apellido</label>
        <input v-model="apellido" type="text" class="form-control" required />
      </div>

      <!-- Apodo -->
      <div class="mb-3">
        <label>Apodo (opcional)</label>
        <input v-model="apodo" type="text" class="form-control" />
      </div>

      <button class="mt-4 btn btn-success w-100" type="submit">Crear cuenta</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/services/supabase'
import router from '@/router'

// utils
import { phoneCountries } from '@/utils/phones_countries'
import { formatPhone } from '@/utils/phones_format'

const email = ref('')
const password = ref('')
const dni = ref('')
const nombre = ref('')
const apellido = ref('')
const apodo = ref('')
const rawCelular = ref('') // número ingresado sin prefijo
const countryCode = ref('+54') // default Argentina 🇦🇷

const phoneCountriesList = phoneCountries

const handleSignUp = async () => {
  const formattedPhone = formatPhone(rawCelular.value, countryCode.value, 'E.164')
  console.log(formattedPhone)

  if (!formattedPhone) {
    alert('Número de celular inválido')
    return
  }

  // Registro en Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    phone: formattedPhone,
  })

  if (error) {
    alert(error.message)
    return
  }
  const user = data.user

  if (user) {
    const { error: insertError } = await supabase.from('Javerim').insert([
      {
        id_auth: user.id,
        email: email.value,
        dni: dni.value,
        nombre: nombre.value,
        apellido: apellido.value,
        apodo: apodo.value || null,
        celular: formattedPhone,
      },
    ])

    if (insertError) {
      alert('Error insertando en Javerim: ' + insertError.message)
    } else {
      alert('Usuario creado con éxito!')
      router.push('/')
    }
  }
}
</script>
