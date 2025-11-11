<template>
  <div class="container mt-5">
    <h2>Lista de Javerim</h2>
    <table class="table table-striped mt-3 align-middle">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>DNI</th>
          <th>Celular</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="j in javerim" :key="j.id" class="hover-effect">
          <td>{{ j.nombre }}</td>
          <td>{{ j.apellido }}</td>
          <td>{{ j.email }}</td>
          <td>{{ j.dni }}</td>
          <td>{{ j.celular }}</td>
          <td>
            <router-link :to="`/javer/${j.dni}`" class="btn btn-sm btn-primary">
              Ver <i class="bi bi-eye"></i>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'

const javerim = ref([])

onMounted(async () => {
  const { data, error } = await supabase.from('Javerim').select('*')
  if (!error) {
    javerim.value = data
  } else {
    console.error(error.message)
  }
})
</script>

<style scoped>
@import url(/src/assets/css/main.css);
</style>
