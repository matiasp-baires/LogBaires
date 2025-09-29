<template>
  <div class="container mt-5" v-if="javer">
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">
          {{ javer.nombre }} {{ javer.apellido }} {{ '(' & javer.apodo & ')' || '' }}
        </h4>
        <p class="card-text"><strong>DNI:</strong> {{ javer.dni }}</p>
        <p class="card-text"><strong>Email:</strong> {{ javer.email }}</p>
        <p class="card-text">
          <strong>Celular:</strong>
          {{ parsePhoneNumberFromString(javer.celular).formatInternational('INTERNATIONAL') }}
        </p>
        <hr />
        <p class="card-text">
          <strong>Áreas:</strong> {{ javer.areas ? javer.areas.join(', ') : '' }}
        </p>
        <p class="card-text">
          <strong>Roles:</strong> {{ javer.roles ? javer.roles.join(', ') : '' }}
        </p>
      </div>
    </div>
  </div>
  <div v-else class="container mt-5">
    <p class="loading">Cargando...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const route = useRoute()
const javer = ref(null)

onMounted(async () => {
  const { data, error } = await supabase
    .from('Javerim')
    .select('*')
    .eq('dni', route.params.dni)
    .single()

  if (!error) {
    javer.value = data
  } else {
    console.error(error.message)
  }
})
</script>
