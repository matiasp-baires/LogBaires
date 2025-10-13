<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 60vh">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else class="container py-4">
    <!-- Header -->
    <header class="row mb-4">
      <h1 class="col-10">Presupuestos</h1>
      <button class="btn btn-success col">Añadir</button>
    </header>

    <main>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Fecha</th>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
            <th scope="col">Creado por</th>
            <th scope="col">Creado para</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(presup, index) in presupuestos" :key="presup.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ new Date(presup.created_at).toLocaleString() }}</td>
            <td>{{ presup.name }}</td>
            <td>{{ presup.description }}</td>
            <td>{{ presup.created_by }}</td>
            <td>{{ presup.created_for }}</td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import Modal from '../components/Modal.vue'
import toast from '@/stores/toast'
const loading = ref(true)
const modal_add = ref(false)

let presupuestos = ref([])
let presup_rows = [
  {
    concept: '',
    description: '',
    quantity: 0,
    amount: 0,
    total_row: 0,
  },
]

onMounted(async () => {
  try {
    loading.value = false
    const { data, error } = await supabase.from('Presupuestos').select('*')
    if (error) throw error
    presupuestos.value = data
  } catch (error) {
    toast.showToast('Error al cargar los presupuestos', 'error')
  } finally {
    loading.value = false
  }
})
</script>
