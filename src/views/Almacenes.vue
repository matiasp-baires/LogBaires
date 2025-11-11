<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 60vh">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else class="container p-4">
    <!-- Header -->
    <div class="row mb-4">
      <h1 class="col-10">Almacenes</h1>
      <button class="btn btn-success col fw-medium" @click="modal_add = true">Añadir</button>
    </div>

    <main id="almacenes" class="row g-3 p-2">
      <div class="col-12 col-md-4" v-for="alm in almacenes" :key="alm.id">
        <div class="almacen card h-100 p-1 justify-between hover-effect">
          <img :src="alm.pic" class="card-img-top" :alt="alm.name" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ alm.name }}</h5>
            <p class="card-text">{{ alm.description }}</p>

            <footer class="mt-auto">
              <div class="card-text">
                <p>
                  <i class="bi bi-geo-alt-fill"></i>
                  <a :href="geocode_link(alm.address)" target="_blank">{{ alm.address }}</a>
                </p>
                <p><i class="bi bi-person-fill-gear"></i> {{ alm.responsable }}</p>
              </div>
              <button @click="openEditModal(alm)" class="btn btn-primary mt-1 w-100">Editar</button>
            </footer>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Update/Delete -->
    <Modal v-model="modal_edit">
      <form @submit.prevent="updateAlmacen" class="p-4 d-flex flex-column gap-3">
        <h4>Editar almacén</h4>
        <div class="mb-2">
          <label class="form-label">Nombre</label>
          <input type="text" v-model="editForm.name" class="form-control" required />
        </div>
        <div class="mb-2">
          <label class="form-label">Imagen (URL)</label>
          <input type="text" v-model="editForm.pic" class="form-control" />
        </div>
        <div class="mb-2">
          <label class="form-label">Dirección</label>
          <input type="text" v-model="editForm.address" class="form-control" />
        </div>
        <div class="mb-2">
          <label class="form-label">Responsable</label>
          <input type="text" v-model="editForm.responsable" class="form-control" />
        </div>
        <div class="mb-2">
          <label class="form-label">Descripción</label>
          <textarea v-model="editForm.description" class="form-control"></textarea>
        </div>
        <div class="d-flex gap-2 mt-3">
          <button type="submit" class="btn btn-primary">Actualizar</button>
          <button type="button" class="btn btn-danger" @click="deleteAlmacen">Eliminar</button>
        </div>
      </form>
    </Modal>

    <!-- Modal de Create -->
    <Modal v-model="modal_add">
      <form @submit.prevent="addAlmacen" class="p-4 d-flex flex-column gap-3">
        <h4>Agregar almacén</h4>
        <div class="mb-2">
          <label class="form-label">Nombre</label>
          <input type="text" v-model="addForm.name" class="form-control" required />
        </div>
        <div class="mb-2">
          <label class="form-label">Imagen (URL)</label>
          <input type="text" v-model="addForm.pic" class="form-control" />
        </div>
        <div class="mb-2">
          <label class="form-label">Dirección</label>
          <input type="text" v-model="addForm.address" class="form-control" />
        </div>
        <div class="mb-2">
          <label class="form-label">Responsable</label>
          <input type="text" v-model="addForm.responsable" class="form-control" />
        </div>
        <div class="mb-2">
          <label class="form-label">Descripción</label>
          <textarea v-model="addForm.description" class="form-control"></textarea>
        </div>
        <div class="d-flex gap-2 mt-3">
          <button type="submit" class="btn btn-success">Agregar</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import Modal from '../components/Modal.vue'
import { geocode_link } from '../utils/geocoder'
import toast from '@/stores/toast'
const almacenes = ref([])
const modal_edit = ref(false)
const modal_add = ref(false)
const loading = ref(true)

const addForm = ref({
  name: '',
  pic: '',
  address: '',
  responsable: '',
  description: '',
})

const editForm = ref({
  id_depot: null,
  name: '',
  pic: '',
  address: '',
  responsable: '',
  description: '',
})

function openEditModal(almacen) {
  editForm.value = {
    id_depot: almacen.id_depot,
    name: almacen.name,
    pic: almacen.pic,
    address: almacen.address,
    responsable: almacen.responsable,
    description: almacen.description,
  }
  modal_edit.value = true
}

async function addAlmacen() {
  try {
    const { data: addAlm, error: errorAddAlm } = await supabase
      .from('Almacenes')
      .insert([addForm.value])
    if (errorAddAlm) throw errorAddAlm
  } catch (errorAddAlm) {
    console.log('Error al agregar almacén:', errorAddAlm)
    toast.showToast('Error al actualizar el almacén', 'error')
  } finally {
    modal_add.value = false
    await fetchAlmacenes()
    toast.showToast('Almacén agregado con éxito', 'success')
  }
}

async function updateAlmacen() {
  try {
    const { data: updAlm, error: errorUpdAlm } = await supabase
      .from('Almacenes')
      .update({
        name: editForm.value.name,
        pic: editForm.value.pic,
        address: editForm.value.address,
        responsable: editForm.value.responsable,
        description: editForm.value.description,
      })
      .eq('id_depot', editForm.value.id_depot)
  } catch (errorUpdAlm) {
    console.log('Error al actualizar almacén:', errorUpdAlm)
    toast.showToast('Error al actualizar el almacén', 'error')
  } finally {
    modal_edit.value = false
    await fetchAlmacenes()
    toast.showToast('Almacén actualizado con éxito', 'success')
  }
}

async function deleteAlmacen() {
  if (!confirm('¿Estás seguro de que deseas eliminar este almacén?')) return
  try {
    const { data: delAlm, error: errorDelAlm } = await supabase
      .from('Almacenes')
      .delete()
      .eq('id_depot', editForm.value.id_depot)

    if (errorDelAlm) throw errorDelAlm

    toast.showToast('Almacén eliminado con éxito', 'success')
  } catch (errorDelAlm) {
    console.log('Error al eliminar almacén:', errorDelAlm)
    toast.showToast('Error al eliminar el almacén', 'error')
  } finally {
    modal_edit.value = false
    await fetchAlmacenes()
    toast.showToast('Almacén eliminado con éxito', 'warning')
  }
}

async function fetchAlmacenes() {
  try {
    const { data, error } = await supabase
      .from('Almacenes')
      .select('*')
      .order('name', { ascending: true })
    almacenes.value = data || []
    if (error) throw error
  } catch (error) {
    console.error('Error al cargar almacenes:', error)
  }
}

onMounted(async () => {
  await fetchAlmacenes()
  loading.value = false
})
</script>

<style scoped>
@import url(/src/assets/css/main.css);
.card-img-top {
  height: 200px;
  object-fit: cover;
  width: 100%;
}
.cursor-pointer {
  cursor: pointer !important;
}
</style>
