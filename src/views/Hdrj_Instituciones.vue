<template>
  <div class="container p-4">
    <!-- Header -->
    <header class="row mb-4">
      <h1 class="col-10">HDRJ - Instituciones</h1>
      <button
        v-if="can(['ADM', 'IT', 'HDRJ'])"
        class="btn btn-success col fw-medium"
        @click="openAddModal()"
      >
        Añadir
      </button>
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

    <main v-else-if="can(['ADM', 'IT', 'HDRJ'])" class="row mb-3 g-2">
      <div class="col-md-6 mb-3 hover-effect" v-for="inst in instituciones" :key="inst.id">
        <div class="card h-100" @dblclick="openEditModal(inst)" style="cursor: pointer">
          <div class="row g-0" style="height: 100%">
            <div class="col d-flex">
              <div class="card-body d-flex flex-column flex-grow-1">
                <h5 class="card-title">{{ inst.name }}</h5>
                <h6 class="card-title">
                  <a :href="geocode_link(inst.address)" target="_blank" rel="noopener noreferrer">
                    <i class="bi bi-geo-alt-fill"></i> {{ inst.address }}
                  </a>
                </h6>
                <div class="card-text mt-3">
                  <div class="text-secondary">
                    <a
                      :href="
                        'https://wa.me/' +
                        formatPhone(
                          inst.contact_phone.toString(),
                          getCountry(inst.contact_phone),
                          'E.164',
                        )
                      "
                      target="_blank"
                    >
                      {{ inst.contact_name }}
                      {{ inst.contact_rol ? '(' + inst.contact_rol + ')' : '' }}:
                      {{ formatPhone(inst.contact_phone.toString(), 'AR', 'INTERNATIONAL') }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-else class="alert alert-danger" role="alert">No puedes acceder a este contenido.</div>

    <div v-if="!loading && instituciones.length === 0" class="alert alert-info" role="alert">
      No hay instituciones registradas.
    </div>

    <!-- Modals -->
    <Modal v-model="modal_add_insti">
      <div class="container p-4">
        <h4>Añadir Institución</h4>

        <form class="row" @submit.prevent="submitAddForm()">
          <div class="mb-3 col-12">
            <label for="inst_name" class="form-label">Nombre<sup class="text-danger">*</sup></label>
            <input
              type="text"
              v-model="inst_name"
              required
              class="form-control"
              id="inst_name"
              placeholder="Colegio..."
            />
          </div>

          <div class="mb-3 col-12">
            <label for="inst_address" class="form-label"
              >Dirección<sup class="text-danger">*</sup></label
            >
            <input
              type="text"
              v-model="inst_address"
              required
              class="form-control"
              id="inst_address"
              placeholder="Av. de Mayo 223..."
            />
          </div>

          <h6 class="col-12 mt-3">Contacto de la institución</h6>
          <div class="col-6">
            <label for="inst_contact_name" class="form-label">Nombre de contacto</label>
            <input
              type="text"
              v-model="inst_contact_name"
              class="form-control"
              id="inst_contact_name"
            />
          </div>
          <div class="col-6 mb-3">
            <label for="inst_contact_name" class="form-label">Cargo institucional</label>
            <input
              type="text"
              v-model="inst_contact_rol"
              class="form-control"
              id="inst_contact_rol"
              placeholder="Director..."
            />
          </div>
          <label class="form-label col-12" for="inst_contact_phone-phone"
            >Teléfono de contacto</label
          >
          <div class="col-12 input-group mb-3">
            <select
              class="form-select"
              v-model="inst_contact_phone_country"
              id="inst_contact_name-country"
            >
              <option :value="pc.code" v-for="pc in phoneCountries" :key="pc.name">
                {{ pc.name }}
              </option>
            </select>
            <input
              type="tel"
              v-model="inst_contact_phone_phone"
              class="form-control"
              id="inst_contact_phone-phone"
              placeholder="1155443322"
            />
          </div>

          <div class="col-12 mt-3 d-flex justify-content-end">
            <button type="submit" class="btn btn-success w-100">Guardar</button>
          </div>
        </form>
      </div>
    </Modal>

    <Modal v-model="modal_edit_insti">
      <div class="container p-4">
        <h4>Añadir Institución</h4>

        <form class="row" @submit.prevent="submitEditForm(inst)">
          <div class="mb-3 col-12">
            <label for="inst_name" class="form-label">Nombre<sup class="text-danger">*</sup></label>
            <input
              type="text"
              v-model="inst_name"
              required
              class="form-control"
              id="inst_name"
              placeholder="Colegio..."
            />
          </div>

          <div class="mb-3 col-12">
            <label for="inst_address" class="form-label"
              >Dirección<sup class="text-danger">*</sup></label
            >
            <input
              type="text"
              v-model="inst_address"
              required
              class="form-control"
              id="inst_address"
              placeholder="Av. de Mayo 223..."
            />
          </div>

          <h6 class="col-12 mt-3">Contacto de la institución</h6>
          <div class="col-6">
            <label for="inst_contact_name" class="form-label">Nombre de contacto</label>
            <input
              type="text"
              v-model="inst_contact_name"
              class="form-control"
              id="inst_contact_name"
            />
          </div>
          <div class="col-6 mb-3">
            <label for="inst_contact_name" class="form-label">Cargo institucional</label>
            <input
              type="text"
              v-model="inst_contact_rol"
              class="form-control"
              id="inst_contact_rol"
              placeholder="Director..."
            />
          </div>
          <label class="form-label col-12" for="inst_contact_phone-phone"
            >Teléfono de contacto</label
          >
          <div class="col-12 input-group mb-3">
            <select
              class="form-select"
              v-model="inst_contact_phone_country"
              id="inst_contact_name-country"
            >
              <option :value="pc.code" v-for="pc in phoneCountries" :key="pc.name">
                {{ pc.name }}
              </option>
            </select>
            <input
              type="tel"
              v-model="inst_contact_phone_phone"
              class="form-control"
              id="inst_contact_phone-phone"
              placeholder="1155443322"
            />
          </div>

          <div class="col-12 mt-5 d-flex justify-self-end">
            <button type="submit" class="btn btn-primary w-100">Actualizar</button>
          </div>
          <div class="col-12 mt-3 d-flex justify-self-end">
            <button
              type="button"
              class="btn btn-danger w-100"
              @click="deleteInstitucion(inst_id.value)"
            >
              Eliminar
            </button>
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
import { formatPhone, getCountry } from '@/utils/phones_format'
import { geocode_link } from '@/utils/geocoder'
import { phoneCountries } from '@/utils/globals/phones_countries'
import toast from '@/stores/toast'
import { useRoles } from '@/services/roles'
const { loading, hasRole, can } = useRoles()
const instituciones = ref([])
const modal_add_insti = ref(false)
const modal_edit_insti = ref(false)

// Refs del formulario
const inst_id = ref('')
const inst_name = ref('')
const inst_address = ref('')
const inst_contact_name = ref('')
const inst_contact_rol = ref('')
const inst_contact_phone_country = ref('')
const inst_contact_phone_phone = ref('')

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
  // Payload for the new institución - renamed to avoid shadowing the response `data`
  const payload = {
    id: crypto.randomUUID(),
    name: inst_name.value,
    address: inst_address.value,
    contact_name: inst_contact_name.value,
    contact_rol: inst_contact_rol.value,
    contact_phone: inst_contact_phone_country.value + inst_contact_phone_phone.value,
  }

  try {
    // Destructure response into `inserted` to avoid name collision with `payload`
    const { data: inserted, error } = await supabase.from('Hdrj_Instituciones').insert([payload])
    if (error) throw error
  } catch (error) {
    console.error('Error adding institución:', error)
    toast.showToast('Error al añadir la institución', 'error')
  } finally {
    // Cerrar modal y resetear formulario
    modal_add_insti.value = false
    inst_name.value = ''
    inst_address.value = ''
    inst_contact_name.value = ''
    inst_contact_rol.value = ''
    inst_contact_phone_country.value = ''
    inst_contact_phone_phone.value = ''
    await fetchInstituciones()
    toast.showToast('Institución añadida con éxito', 'success')
  }
}
async function submitEditForm(inst) {
  // Similar to submitAddForm but for editing an existing institución
  // You would need to track which institución is being edited
  const payload = {
    id: inst_id.value,
    name: inst_name.value,
    address: inst_address.value,
    contact_name: inst_contact_name.value,
    contact_rol: inst_contact_rol.value,
    contact_phone: inst_contact_phone_country.value + inst_contact_phone_phone.value,
  }
  try {
    const { data: updated, error } = await supabase
      .from('Hdrj_Instituciones')
      .update(payload)
      .eq('id', inst_id.value)
    if (error) throw error
  } catch (error) {
    console.error('Error updating institución:', error)
    toast.showToast('Error al actualizar la institución', 'error')
  } finally {
    modal_edit_insti.value = false
    inst_id.value = ''
    inst_name.value = ''
    inst_address.value = ''
    inst_contact_name.value = ''
    inst_contact_rol.value = ''
    inst_contact_phone_country.value = ''
    inst_contact_phone_phone.value = ''
    await fetchInstituciones()
    toast.showToast('Institución actualizada con éxito', 'success')
  }
}
async function deleteInstitucion(inst) {
  if (
    !confirm(
      '¿Estás seguro de que deseas eliminar esta institución? Esta acción no se puede deshacer.',
    )
  ) {
    return
  }

  try {
    const { data, error } = await supabase
      .from('Hdrj_Instituciones')
      .delete()
      .eq('id', inst_id.value)
    if (error) throw error
  } catch (error) {
    console.error('Error deleting institución:', error)
    toast.showToast('Error al eliminar la institución', 'error')
  } finally {
    modal_edit_insti.value = false
    inst_id.value = ''
    inst_name.value = ''
    inst_address.value = ''
    inst_contact_name.value = ''
    inst_contact_rol.value = ''
    inst_contact_phone_country.value = ''
    inst_contact_phone_phone.value = ''
    await fetchInstituciones()
    toast.showToast('Institución eliminada con éxito', 'success')
  }
}

function openAddModal() {
  inst_name.value = ''
  inst_address.value = ''
  inst_contact_name.value = ''
  inst_contact_rol.value = ''
  inst_contact_phone_country.value = ''
  inst_contact_phone_phone.value = ''
  modal_add_insti.value = true
}
function openEditModal(inst) {
  // Populate form fields with existing data
  inst_id.value = inst.id
  inst_name.value = inst.name
  inst_address.value = inst.address
  inst_contact_name.value = inst.contact_name
  inst_contact_rol.value = inst.contact_rol
  // Split contact_phone into country code and phone number
  const countryCodeLength = inst.contact_phone.length - 10 // Assuming last 10 digits are the phone number
  inst_contact_phone_country.value = inst.contact_phone.slice(0, countryCodeLength)
  inst_contact_phone_phone.value = inst.contact_phone.slice(countryCodeLength)
  modal_edit_insti.value = true
}

onMounted(async () => {
  await fetchInstituciones()
})
</script>

<style scoped>
@import url(/src/assets/css/main.css);
</style>
