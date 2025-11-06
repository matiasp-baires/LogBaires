<template>
  <div class="container py-4">
    <!-- Header -->
    <header class="row mb-4">
      <h1 class="col-10">HDRJ - Espacios</h1>
      <button class="btn btn-success col" @click="openAddModal()">Añadir</button>
    </header>

    <!-- Loading -->
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
        <div class="card h-100" :class="espacio_border(esp)" @dblclick="openEditModal(esp)">
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
                      {{ formatDateTime(esp.se_libera) }}
                    </p>
                    <small class="text-body-secondary">
                        Última actualización {{ formatDateTime(esp.actualizado) }}
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
            <form class="row" @submit.prevent="submitAddForm()">
                <div class="col-12 mb-3">
                    <label for="esp-nombre" class="form-label">Nombre del espacio <span class="text-danger">*</span></label>
                    <input type="text" v-model="esp_nombre" class="form-control" id="esp-nombre" placeholder="Gimnasio #2">
                </div>
                <div class="col-12 mb-3">
                    <label for="esp-referencia" class="form-label">Refencia</label>
                    <textarea type="text" v-model="esp_referencia" class="form-control" id="esp-referencia" rows="3" placeholder="2°P yendo por las escaleras"></textarea>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-libera" class="form-label">¿Cuando se libera?</label>
                    <input type="datetime-local" v-model="esp_se_libera" class="form-control" id="esp-libera" >
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-actualizacion" class="form-label">Última actualización</label>
                    <input type="text" :placeholder="esp_actualizado ? formatDateTime(esp_actualizado) : 'Sin registro'" disabled class="form-control" id="esp-actualizacion">
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-institucion" class="form-label">Institución <span class="text-danger">*</span></label>
                    <select class="form-select" v-model="esp_institucion" id="esp-institucion">
                        <option v-for="inst in instituciones" :key="inst.id" :value="inst.id">{{ inst.name }}</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-javer" class="form-label">¿Quién actualizó?</label>
                    <input type="text" disabled class="form-control" id="esp-javer" :placeholder="javer ? `${javer.nombre} ${javer.apellido} ${javer.apodo ? ' - '+javer.apodo : ''}` : 'No identificado'">
                </div>
                <div class="col-12 mb-3">
                    <label for="esp-imagen" class="form-label">Imagen del espacio</label>
                    <input 
                      type="file" 
                      class="form-control" 
                      id="esp-imagen" 
                      @change="handleImageChange"
                      accept="image/*">
                </div>
                <div class="col-12 mt-5 mb-3">
                  <button class="btn btn-primary w-100" type="submit">Guardar</button>
                </div>
            </form>
        </div>
    </Modal>

    <!-- Modal Editar -->
    <Modal v-model="modal_edit_espacio">
        <div class="container p-4">
            <h4 class="row">Editar espacio</h4>
            <form class="row" @submit.prevent="submitEditForm()">
                <div class="col-12 mb-3">
                    <label for="esp-nombre-edit" class="form-label">Nombre del espacio <span class="text-danger">*</span></label>
                    <input type="text" v-model="esp_nombre" class="form-control" id="esp-nombre-edit" placeholder="Gimnasio #2">
                </div>
                <div class="col-12 mb-3">
                    <label for="esp-referencia-edit" class="form-label">Refencia</label>
                    <textarea type="text" v-model="esp_referencia" class="form-control" id="esp-referencia-edit" rows="3" placeholder="2°P yendo por las escaleras"></textarea>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-libera-edit" class="form-label">¿Cuando se libera?</label>
                    <input type="datetime-local" v-model="esp_se_libera" class="form-control" id="esp-libera-edit" >
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-actualizacion-edit" class="form-label">Última actualización</label>
                    <input type="text" :placeholder="esp_actualizado ? formatDateTime(esp_actualizado)  : 'Sin registro'" disabled class="form-control" id="esp-actualizacion-edit">
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-institucion-edit" class="form-label">Institución <span class="text-danger">*</span></label>
                    <select class="form-select" v-model="esp_institucion" id="esp-institucion-edit">
                        <option v-for="inst in instituciones" :key="inst.id" :value="inst.id">{{ inst.name }}</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="esp-javer-edit" class="form-label">¿Quién actualizó?</label>
                    <input type="text" disabled class="form-control" id="esp-javer-edit" :placeholder="javer ? `${javer.nombre} ${javer.apellido} ${javer.apodo ? ' - '+javer.apodo : ''}` : 'No identificado'">
                </div>
                <div class="col-12 mb-3">
                    <label for="esp-imagen-edit" class="form-label">Imagen del espacio</label>
                    <input 
                      type="file" 
                      class="form-control" 
                      id="esp-imagen-edit" 
                      @change="handleImageChange"
                      accept="image/*">
                </div>
                <div class="col-12 mt-5 mb-3 d-flex gap-2">
                    <button type="submit" class="btn btn-primary flex-grow-1">Actualizar</button>
                    <button type="button" @click="deleteEspacio" class="btn btn-danger">Eliminar</button>
                </div>
            </form>
        </div>
    </Modal>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, unref } from 'vue'
import { supabase } from '@/services/supabase'
import Modal from '@/components/Modal.vue'
import toast from '@/stores/toast'
import { formatDateTime } from '@/utils/formatDate'
import { useFormImage } from '@/composables/useFormImage'

const { 
  imagePreview,
  handleImageChange,
  uploadImage,
  updateImage,
  deleteImage,
  clearImage
} = useFormImage('Espacios')


const loading = ref(true)
const espacios = ref([])
const instituciones = ref([])
const user = ref(null) // objeto de supabase.auth
const javer = ref(null) // objeto javer desde la tabla Javerim
const modal_add_espacio = ref(false)
const modal_edit_espacio = ref(false)
const current_espacio_id = ref(null) // Para tracking del espacio en edición

const esp_nombre = ref('')
const esp_referencia = ref('')
const esp_se_libera = ref('')
const esp_institucion = ref('')
const esp_actualizado = ref('')
const esp_javer = ref('')
const currentEspacio = ref(null)

function espacio_border(esp) {
  const now = new Date()
  const se_libera = new Date(esp.se_libera)
  const diffMinutes = (se_libera - now) / (1000 * 60)

  if (diffMinutes <= 0) return 'border border-1 border-success shadow-success'
  if (diffMinutes <= 15) return 'border border-1 border-warning shadow-warning'
  if (diffMinutes > 15) return 'border border-1 border-danger shadow-danger'
  return 'border border-1 shadow'
}

function getInstitucionLabel(id) {
  // instituciones is a ref; unwrap it safely and guard if it's not an array
  const instList = unref(instituciones) || []
  if (!Array.isArray(instList)) return 'Institución desconocida'
  const inst = instList.find((i) => i.id === id)
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
async function fetchInstituciones() {
  try {
    const { data, error } = await supabase
        .from('Hdrj_Instituciones')
        .select('*')
        .order('name', { ascending: true })
    instituciones.value = data || []
    if (error) throw error
  } catch (error) {
    console.error('Error fetching instituciones:', error)
  }
}

async function submitAddForm() {
  if (!esp_nombre.value || !esp_institucion.value) {
    toast.showToast('Por favor completa los campos requeridos', 'error')
    return
  }

  try {
    const now = new Date().toISOString()
    
    // Subir imagen si existe
    const imageResult = await uploadImage()

    const payload = {
      nombre: esp_nombre.value,
      referencia: esp_referencia.value,
      se_libera: esp_se_libera.value,
      institucion: esp_institucion.value,
      actualizado: now,
      actualizado_javer: javer.value?.id_jvr || null,
      pic: imageResult?.url || null,
      pic_path: imageResult?.path || null
    }

    const { error } = await supabase.from('Hdrj_Espacios').insert([payload])
    if (error) throw error

    modal_add_espacio.value = false
    resetForm()
    await fetchEspacios()
    toast.showToast('Espacio añadido con éxito', 'success')
  } catch (error) {
    console.error('Error adding espacio:', error)
    toast.showToast('Error al añadir el espacio', 'error')
  }
}

function resetForm() {
  esp_nombre.value = ''
  esp_referencia.value = ''
  esp_se_libera.value = ''
  esp_institucion.value = ''
  esp_actualizado.value = ''
  esp_javer.value = ''
  current_espacio_id.value = null
  currentEspacio.value = null
}


function openAddModal() {
  resetForm()
  modal_add_espacio.value = true
}
function openEditModal(espacio) {
  // Poblar el formulario con los datos del espacio
  esp_nombre.value = espacio.nombre
  esp_referencia.value = espacio.referencia
  esp_se_libera.value = new Date(espacio.se_libera).toISOString()
  esp_institucion.value = espacio.institucion
  esp_actualizado.value = espacio.actualizado
  current_espacio_id.value = espacio.id
  currentEspacio.value = espacio
  modal_edit_espacio.value = true
}

async function submitEditForm() {
  if (!current_espacio_id.value || !esp_nombre.value || !esp_institucion.value) {
    toast.showToast('Por favor completa los campos requeridos', 'error')
    return
  }

  try {
    const now = new Date().toISOString()
    
    // Actualizar imagen si hay una nueva
    const imageResult = await updateImage(currentEspacio.value?.pic_path)

    const payload = {
      nombre: esp_nombre.value,
      referencia: esp_referencia.value,
      se_libera: new Date(esp_se_libera.value).toISOString(),
      institucion: esp_institucion.value,
      actualizado: now,
      actualizado_javer: javer.value?.id_jvr || null,
      pic: imageResult?.url || currentEspacio.value?.pic,
      pic_path: imageResult?.path || currentEspacio.value?.pic_path
    }

    const { error } = await supabase
      .from('Hdrj_Espacios')
      .update(payload)
      .eq('id', current_espacio_id.value)

    if (error) throw error

    modal_edit_espacio.value = false
    resetForm()
    await fetchEspacios()
    toast.showToast('Espacio actualizado con éxito', 'success')
  } catch (error) {
    console.error('Error updating espacio:', error)
    toast.showToast('Error al actualizar el espacio', 'error')
  }
}

async function deleteEspacio() {
  if (!current_espacio_id.value) return

  if (!confirm('¿Estás seguro de que deseas eliminar este espacio?')) return

  try {
    // Eliminar imagen si existe
    if (currentEspacio.value?.pic_path) {
      await deleteImage(currentEspacio.value.pic_path)
    }

    const { error } = await supabase
      .from('Hdrj_Espacios')
      .delete()
      .eq('id', current_espacio_id.value)

    if (error) throw error

    modal_edit_espacio.value = false
    resetForm()
    await fetchEspacios()
    toast.showToast('Espacio eliminado con éxito', 'success')
  } catch (error) {
    console.error('Error deleting espacio:', error)
    toast.showToast('Error al eliminar el espacio', 'error')
  }
}

onMounted(async () => {
  loading.value = true
  await fetchInstituciones()
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
.shadow {
  box-shadow: 0 0 10px rgba(60, 60, 56, 0.7); /* verde bootstrap */
}


</style>
