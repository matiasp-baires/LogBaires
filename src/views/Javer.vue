<template>
  <div class="container mt-5" v-if="javer">
    <div class="position-relative">
      <button
        v-if="canEdit"
        class="btn btn-sm btn-outline-primary position-absolute top-0 end-0"
        @click="showModal = true"
        title="Editar"
        style="margin-top: 10px; margin-right: 10px; z-index: 100"
      >
        <i class="bi bi-pencil-square"></i> Editar
      </button>
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">
            {{ javer.nombre }} {{ javer.apellido }} {{ javer.apodo ? ' - ' + javer.apodo : '' }}
          </h4>
          <p class="card-text"><strong>DNI:</strong> {{ javer.dni }}</p>
          <p class="card-text">
            <strong>Email:</strong> <a :href="'mailto:' + javer.email">{{ javer.email }}</a>
          </p>
          <p class="card-text">
            <strong>Celular: </strong>
            <a
              :href="
                'http://wa.me/' +
                parsePhoneNumberFromString(javer.celular).format('E.164').replace('+', '')
              "
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ parsePhoneNumberFromString(javer.celular).formatInternational('INTERNATIONAL') }}
            </a>
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
  </div>
  <div v-else class="container mt-5">
    <p class="loading">Cargando...</p>
  </div>

  <!-- Modal de Edición -->
  <Modal v-model="showModal">
    <div class="container p-4">
      <h5 class="mb-4">Editar datos de {{ javer?.nombre }}</h5>
      <form @submit.prevent="updateJaver" class="row">
        <div class="col-12 mb-3">
          <label for="dni" class="form-label">DNI</label>
          <input v-model="formData.dni" type="text" class="form-control" id="dni" disabled />
        </div>

        <div class="col-12 col-md-6 mb-3">
          <label for="nombre" class="form-label">Nombre</label>
          <input v-model="formData.nombre" type="text" class="form-control" id="nombre" required />
        </div>

        <div class="col-12 col-md-6 mb-3">
          <label for="apellido" class="form-label">Apellido</label>
          <input
            v-model="formData.apellido"
            type="text"
            class="form-control"
            id="apellido"
            required
          />
        </div>

        <div class="col-12 mb-3">
          <label for="apodo" class="form-label">Apodo</label>
          <input v-model="formData.apodo" type="text" class="form-control" id="apodo" />
        </div>

        <div class="col-12 col-md-6 mb-3">
          <label for="email" class="form-label">E-Mail</label>
          <input v-model="formData.email" type="email" class="form-control" id="email" required />
        </div>

        <div class="col-12 col-md-6 mb-3">
          <label for="celular" class="form-label">Celular</label>
          <input
            v-model="formData.celular"
            type="text"
            class="form-control"
            id="celular"
            required
          />
        </div>

        <div v-if="can('ADM', 'IT')" class="col-12 col-md-6 mb-3">
          <label for="areas" class="form-label">Áreas</label>
          <input
            v-model="formData.areas"
            type="text"
            class="form-control"
            id="areas"
            placeholder="Separadas por coma"
          />
        </div>

        <div v-if="can('ADM', 'IT')" class="col-12 col-md-6 mb-3">
          <label for="roles" class="form-label">Roles</label>
          <input
            v-model="formData.roles"
            type="text"
            class="form-control"
            id="roles"
            placeholder="Separados por coma"
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">Guardar Cambios</button>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import Modal from '@/components/Modal.vue'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import toast from '@/stores/toast'
import { useRoles } from '@/services/roles'
import { getJaverFromSession } from '@/utils/getJaver'
import router from '@/router'
const { loading, hasRole, hasAny, can } = useRoles()
const load_content = ref(false)
const canEdit = ref(false)

const route = useRoute()
const javer = ref(null)
const showModal = ref(false)
const currentUser = ref(null)
const formData = ref({
  dni: '',
  nombre: '',
  apellido: '',
  apodo: '',
  email: '',
  celular: '',
  areas: '',
  roles: '',
})

onMounted(async () => {
  const user = await getJaverFromSession()
  console.table(user)
  currentUser.value = user

  try {
    const { data, error } = await supabase
      .from('Javerim')
      .select('*')
      .eq('dni', route.params.dni)
      .single()

    if (error) throw error

    javer.value = data
    initializeFormData(data)

    // Verificar permisos: ADM, IT o es el usuario mismo
    canEdit.value = can('ADM', 'IT') || (user && user.dni === route.params.dni)
  } catch (error) {
    console.error(error)
  }
})

function initializeFormData(data) {
  formData.value = {
    dni: data.dni,
    nombre: data.nombre,
    apellido: data.apellido,
    apodo: data.apodo || '',
    email: data.email,
    celular: data.celular,
    areas: Array.isArray(data.areas) ? data.areas.join(', ') : data.areas || '',
    roles: Array.isArray(data.roles) ? data.roles.join(', ') : data.roles || '',
  }
}

async function updateJaver() {
  try {
    const updateData = {
      nombre: formData.value.nombre,
      apellido: formData.value.apellido,
      apodo: formData.value.apodo,
      email: formData.value.email,
      celular: formData.value.celular,
      areas: formData.value.areas
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a),
      roles: formData.value.roles
        .split(',')
        .map((r) => r.trim())
        .filter((r) => r),
    }

    const { error } = await supabase
      .from('Javerim')
      .update(updateData)
      .eq('id_jvr', javer.value.id_jvr)

    if (error) {
      console.error('Error actualizando:', error.message)
      toast.showToast('Error al actualizar el Javer', 'error')
    } else {
      javer.value = { ...javer.value, ...updateData }
      showModal.value = false
    }
  } catch (error) {
    console.error('Error:', error)
    toast.showToast('Error al actualizar el Javer', 'error')
  } finally {
    toast.showToast('Javer actualizado con éxito', 'success')
  }
}
</script>

