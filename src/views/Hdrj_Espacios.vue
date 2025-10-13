<template>
  <div class="container py-4">
    <!-- Header -->
    <header class="row mb-4">
      <h1 class="col-10">HDRJ - Espacios</h1>
      <button class="btn btn-success col" @click="modal_add_espacio = true"><i class="bi bi-plus-circle"></i> Añadir</button>
    </header>

    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center"
      style="height: 60vh"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <main class="row mb-3 g-2">
      <div class="col-md-6 mb-3" v-for="esp in espacios" :key="esp.id">
        <div class="card h-100" :class="espacio_border(esp)">
          <div class="row g-0" style="height: 100%">
            <div class="col-md-5 d-flex  align-items-stretch p-1">
              <img
                :src="esp.pic || '/public/default_espacio.webp'"
                class="img-fluid w-100 rounded-1 h-100 object-fit-cover"
                :alt="esp.nombre"
              />
            </div>
            <div class="col-md-7 d-flex">
              <div class="card-body d-flex flex-column flex-grow-1">
                <h5 class="card-title">{{ esp.nombre }}</h5>
                <h6 class="card-title">{{ getInstitucionLabel(esp.institucion) }}</h6>
                <p class="card-text">
                  <i>{{ esp.referencia }}</i>
                </p>
                
                <p class="card-text mt-auto mb-0">
                    <p class="card-text">
                      <i class="bi bi-stopwatch-fill"></i> <strong>Se libera</strong>:
                      {{ new Date(esp.se_libera).toLocaleString() }}
                    </p>
                    <small class="text-body-secondary">
                        Última actualización {{ new Date(esp.actualizado).toLocaleString() }}
                    </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="!loading && espacios.length === 0" class="alert alert-info" role="alert">
      No hay espacios registrados.
    </div>

    <!-- Modals -->
    <Modal v-model="modal_add_espacio">
        <div class="container p-4">
            <h4 class="row">Agregar espacio</h4>
            <form action="" class="row">
                <div class="col-12 mb-3">
                    <label for="esp-nombre" class="form-label">Nombre del espacio <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="esp-nombre" placeholder="Gimnasio #2">
                </div>
                <div class="col-12 mb-3">
                    <label for="esp-referencia" class="form-label">Refencia</label>
                    <textarea type="text" class="form-control" id="esp-referencia" rows="3" placeholder="2°P yendo por las escaleras"></textarea>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-libera" class="form-label">¿Cuando se libera?</label>
                    <input type="date" class="form-control" id="esp-libera" >
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-actualizacion" class="form-label">Última actualización</label>
                    <input type="date" disabled class="form-control" id="esp-actualizacion">
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-institucion" class="form-label">Institución <span class="text-danger">*</span></label>
                    <select class="form-select" id="esp-institucion">
                        <option v-for="inst in instituciones" :key="inst.id" :value="inst.id">{{ inst.name }}</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-javer" class="form-label">¿Quién actualizó?</label>
                    <input type="text" disabled class="form-control" id="esp-javer" :value="javer ? `${javer.nombre} ${javer.apellido} ${javer.apodo ? ' - '+javer.apodo : ''}` : 'No identificado'">
                </div>
                <div class="col-12 mt-5 mb-3">
                    <button class="btn btn-primary w-100" type="submit">Guardar</button>
                </div>
            </form>
        </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import Modal from '@/components/Modal.vue'

const loading = ref(true)
const espacios = ref([])
const user = ref(null) // objeto de supabase.auth
const javer = ref(null) // objeto javer desde la tabla Javerim
const modal_add_espacio = ref(false)
const modal_edit_espacio = ref(false)
const instituciones = [
  {
    id: 'd3795d0f-fd5f-40cb-a511-21932db9eee7',
    name: 'Bet El',
    address: 'Conde 1860, CABA',
    contact: { name: 'Pablo', phone: '1158021869', rol: 'Kabat' },
  },
  {
    id: 'd3d94767-096a-41fe-b5ec-4c9fe83bc2a6',
    name: 'Tarbut',
    address: 'Av. Cramer 3200, CABA',
    contact: { name: '', phone: '1164641027', rol: 'Director' },
  },
]

function espacio_border(esp) {
  const now = new Date()
  const se_libera = new Date(esp.se_libera)
  const diffMinutes = (se_libera - now) / (1000 * 60)

  if (diffMinutes <= 0) return 'border border-1 border-success shadow-success'
  if (diffMinutes <= 15) return 'border border-1 border-warning shadow-warning'
  if (diffMinutes <= 30) return 'border border-1 border-danger shadow-danger'
  return 'border shadow'
}
function getInstitucionLabel(id) {
  const inst = instituciones.find((i) => i.id === id)
  return inst ? `${inst.name} - ${inst.address}` : 'Institución desconocida'
}

async function fetchEspacios() {
  try {
    const { data, error } = await supabase.from('Hdrj_Espacios').select('*')
    espacios.value = data || []
    if (error) throw error
  } catch (error) {
    console.error('Error fetching espacios:', error)
  }
}

onMounted(async () => {
  await fetchEspacios()

  // Obtener sesión actual
  const { data } = await supabase.auth.getUser()
  user.value = data.user || null

    if (user.value) {
        // Buscar el dni en tabla Javerim
        const { data, error } = await supabase
        .from('Javerim')
        .select('id_jvr, nombre,apellido, apodo')
        .eq('id_auth', user.value.id) // id de auth.users
        .single()

        if (!error && data) {
        javer.value = data
        console.log(javer.value)
        }

    }
  loading.value = false
})
</script>

<style scoped>
.shadow-danger {
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.7); /* rojo bootstrap */
}

.shadow-warning {
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.7); /* amarillo bootstrap */
}

.shadow-success {
  box-shadow: 0 0 10px rgba(25, 135, 84, 0.7); /* verde bootstrap */
}


</style>
