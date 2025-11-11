<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 60vh">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else class="container mt-4">
    <!-- Header -->
    <div class="row mb-4">
      <h1 class="col-10">Stocks</h1>
      <button class="btn btn-success col fw-medium" @click="openAddStockModal">Añadir</button>
    </div>

    <!-- Almacenes HDRJ-->
    <section v-if="can(['ADM', 'IT', 'HDRJ'])" class="row mb-4 accordion" id="almacenes1">
      <h2>Almacén de HDRJ</h2>
      <section
        class="accordion col-12"
        :id="'almacen1' + index"
        v-for="(alm, index) in almacenesHDRJ"
        :key="alm.id_depot"
      >
        <div class="accordion-item mb-3">
          <h3 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="'#almacenCollapse1-' + index"
              aria-expanded="false"
              :aria-controls="'almacenCollapse1-' + index"
              style="font-weight: bold"
            >
              {{ alm.name }}
            </button>
          </h3>

          <div :id="'almacenCollapse1-' + index" class="accordion-collapse collapse">
            <div class="accordion-body">
              <table class="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th class="text-end">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(stk, sIndex) in getStocksByAlmacen(alm.id_depot)"
                    :key="stk.id"
                    @click="openEditStockModal(stk)"
                    class="hover-effect"
                  >
                    <th scope="row">{{ sIndex + 1 }}</th>
                    <td style="font-weight: bold">{{ stk.nombre }}</td>
                    <td>{{ stk.descripcion }}</td>
                    <td>{{ stk.categoria }}</td>
                    <td class="text-end">{{ stk.cantidad }}</td>
                  </tr>

                  <tr v-if="getStocksByAlmacen(alm.id_depot).length === 0">
                    <td colspan="5" class="text-center text-muted">Sin stock registrado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </section>

    <!-- Almacenes Log-->
    <main v-if="can(['ADM', 'IT', 'LOG', 'HBTJ'])" class="row mb-4 accordion" id="almacenes2">
      <h2>Almacén de LOG y HBTJ</h2>
      <section
        class="accordion col-12"
        :id="'almacen2' + index"
        v-for="(alm, index) in almacenesLog"
        :key="alm.id_depot"
      >
        <div class="accordion-item mb-3">
          <h3 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="'#almacenCollapse2-' + index"
              aria-expanded="false"
              :aria-controls="'almacenCollapse2-' + index"
              style="font-weight: bold"
            >
              {{ alm.name }}
            </button>
          </h3>

          <div :id="'almacenCollapse2-' + index" class="accordion-collapse collapse">
            <div class="accordion-body">
              <table class="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th class="text-end">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(stk, sIndex) in getStocksByAlmacen(alm.id_depot)"
                    :key="stk.id"
                    @click="openEditStockModal(stk)"
                    class="hover-effect"
                  >
                    <th scope="row">{{ sIndex + 1 }}</th>
                    <td style="font-weight: bold">{{ stk.nombre }}</td>
                    <td>{{ stk.descripcion }}</td>
                    <td>{{ stk.categoria }}</td>
                    <td class="text-end">{{ stk.cantidad }}</td>
                  </tr>

                  <tr v-if="getStocksByAlmacen(alm.id_depot).length === 0">
                    <td colspan="5" class="text-center text-muted">Sin stock registrado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- MODALS -->
    <!-- Agregar stock -->
    <Modal v-model="modal_add_stock">
      <div class="container p-4">
        <h5 class="row mb-3">Agregar stock</h5>
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          <strong><i class="bi bi-exclamation-triangle-fill"></i> Atención!</strong> Este formulario
          es únicamente para agregar stock. Si deseas mover stock entre almacenes, debes hacerlo
          desde la sección de <strong>Movimientos</strong>.
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
        <form @submit.prevent="sendAddStockForm" class="row mb-3">
          <div class="col-12 mb-3">
            <label for="stk-alias" class="form-label">Alias</label>
            <input
              type="text"
              class="form-control"
              disabled
              v-model="form_add_stock.alias"
              id="stk-alias"
              placeholder="STK:"
            />
          </div>
          <div class="col-12 mb-3">
            <label for="stk-nombre" class="form-label">Nombre</label>
            <input
              type="text"
              class="form-control"
              v-model="form_add_stock.nombre"
              id="stk-nombre"
              placeholder="Linternas..."
              required
            />
          </div>
          <div class="col-12 mb-3">
            <label for="stk-descripcion" class="form-label">Descripción</label>
            <textarea
              type="text"
              class="form-control"
              v-model="form_add_stock.descripcion"
              id="stk-descripcion"
              placeholder="Linternas de 3000Lúmens Marca..."
              rows="3"
            ></textarea>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <label for="stk-categoria" class="form-label">Categoría</label>
            <select
              id="stk-categoria"
              v-model="form_add_stock.categoria"
              class="form-select"
              required
            >
              <option value="" disabled>Elegir categoría</option>
              <option v-for="cat in Stock_Categories" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <label for="stk-cantidad" class="form-label">Cantidad</label>
            <input
              type="number"
              v-model="form_add_stock.cantidad"
              class="form-control"
              id="stk-cantidad"
              placeholder="25..."
              min="1"
              required
            />
          </div>
          <div class="col-12 mb-3">
            <label for="stk-almacen" class="form-label">Almacén</label>
            <select id="stk-almacen" v-model="form_add_stock.almacen" class="form-select" required>
              <option value="" disabled>Elegir categoría</option>
              <option v-for="alm in almacenesLog" :value="alm.id_depot" :key="alm.id_depot">
                {{ alm.name }}
              </option>
            </select>
          </div>
          <button type="submit" class="btn btn-success col-12 my-4">Añadir</button>
        </form>
      </div>
    </Modal>

    <!-- Editar / eliminar stock -->
    <Modal v-model="modal_edit_stock">
      <div class="container p-4">
        <h5 class="row mb-3">Editar stock</h5>
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          <strong><i class="bi bi-exclamation-triangle-fill"></i> Atención!</strong> Este formulario
          es únicamente para editar stock. Si deseas mover stock entre almacenes, debes hacerlo
          desde la sección de <strong>Movimientos</strong>.
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>

        <form @submit.prevent="sendEditStockForm" class="row mb-3">
          <div class="col-12 mb-3">
            <label for="stk-alias" class="form-label">Alias</label>
            <input
              type="text"
              class="form-control"
              disabled
              v-model="form_edit_stock.alias"
              id="stk-alias"
              placeholder="STK:"
            />
          </div>
          <div class="col-12 mb-3">
            <label for="stk-nombre" class="form-label">Nombre</label>
            <input
              type="text"
              class="form-control"
              v-model="form_edit_stock.nombre"
              id="stk-nombre"
              placeholder="Linternas..."
              required
            />
          </div>
          <div class="col-12 mb-3">
            <label for="stk-descripcion" class="form-label">Descripción</label>
            <textarea
              type="text"
              class="form-control"
              v-model="form_edit_stock.descripcion"
              id="stk-descripcion"
              placeholder="Linternas de 3000Lúmens Marca..."
              rows="3"
            ></textarea>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <label for="stk-categoria" class="form-label">Categoría</label>
            <select
              id="stk-categoria"
              v-model="form_edit_stock.categoria"
              class="form-select"
              required
            >
              <option value="" disabled>Elegir categoría</option>
              <option v-for="cat in Stock_Categories" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <label for="stk-cantidad" class="form-label">Cantidad</label>
            <input
              type="number"
              v-model="form_edit_stock.cantidad"
              class="form-control"
              id="stk-cantidad"
              placeholder="25..."
              min="1"
              required
            />
          </div>
          <div class="col-12 mb-3">
            <label for="stk-almacen" class="form-label">Almacén</label>
            <select id="stk-almacen" v-model="form_edit_stock.almacen" class="form-select" required>
              <option value="" disabled>Elegir categoría</option>
              <option v-for="alm in almacenesLog" :value="alm.id_depot" :key="alm.id_depot">
                {{ alm.name }}
              </option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary col-12 mt-4 mb-2">Editar</button>
          <button class="btn btn-danger col-12 mb-4" @click="deleteStock">Eliminar</button>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { supabase } from '@/services/supabase'
import toast from '@/stores/toast'
import Modal from '@/components/Modal.vue'
import { Stock_Categories } from '@/utils/globals/Stock_Categories'
import { Set_Stock_Alias } from '@/utils/globals/Stock_Alias'
import { useRoles } from '@/services/roles'
// Avoid name collision: roles provides a loading state for roles; we need a local
// loading flag to control the page spinner lifecycle.
const { loading: rolesLoading, hasRole, can } = useRoles()
const loading = ref(true)

const almacenes = ref([])
const stocks = ref([])
const modal_add_stock = ref(false)
const modal_edit_stock = ref(false)

// Computed filters: almacenes HDRJ-only (category array contains exclusively 'HDRJ')
// and almacenes Log (todos los almacenes que NO contienen 'HDRJ' en su array de category)
const almacenesHDRJ = computed(() => {
  return almacenes.value.filter((a) => {
    const raw = a.category ?? a.categoria ?? []
    const cats = Array.isArray(raw) ? raw : typeof raw === 'string' ? [raw] : []
    // solo HDRJ si todas las categorías son 'HDRJ' y hay al menos una
    return cats.length > 0 && cats.every((c) => c === 'HDRJ')
  })
})

const almacenesLog = computed(() => {
  return almacenes.value.filter((a) => {
    const raw = a.category ?? a.categoria ?? []
    const cats = Array.isArray(raw) ? raw : typeof raw === 'string' ? [raw] : []
    // incluir en Log solo si NO incluye 'HDRJ' en las categorías
    return !cats.includes('HDRJ')
  })
})

const form_add_stock = ref({
  alias: null,
  nombre: '',
  descripcion: '',
  categoria: '',
  cantidad: 1,
  almacen: null,
})
const form_edit_stock = ref({
  id: null,
  alias: null,
  nombre: '',
  descripcion: '',
  categoria: '',
  cantidad: 1,
  almacen: null,
})

// 🔹 Actualiza alias cada vez que cambian nombre o categoría
watch(
  () => [form_add_stock.value.nombre, form_add_stock.value.categoria],
  ([nombre, categoria]) => {
    form_add_stock.value.alias = Set_Stock_Alias(categoria, nombre)
  },
)
watch(
  () => [form_edit_stock.value.nombre, form_edit_stock.value.categoria],
  ([nombre, categoria]) => {
    form_edit_stock.value.alias = Set_Stock_Alias(categoria, nombre)
  },
)

function openAddStockModal() {
  form_add_stock.value = {
    alias: null,
    nombre: '',
    descripcion: '',
    categoria: '',
    cantidad: 1,
    almacen: null,
  }
  modal_add_stock.value = true
}
async function sendAddStockForm() {
  console.log('Enviar formulario de agregar stock:', form_add_stock.value)
  try {
    const { data, error } = await supabase.from('Stocks').insert([form_add_stock.value])
    if (error) throw error
  } catch (error) {
    console.error('Error al agregar stock:', error)
    toast.showToast('Error al agregar stock', 'error')
  } finally {
    modal_add_stock.value = false
    await fetchStocks()
    toast.showToast('Stock agregado con éxito', 'success')
  }
}

function openEditStockModal(stock) {
  form_edit_stock.value = { ...stock }
  modal_edit_stock.value = true
}
async function sendEditStockForm() {
  try {
    const { data, error } = await supabase
      .from('Stocks')
      .update({ ...form_edit_stock.value })
      .eq('id', form_edit_stock.value.id)
    if (error) throw error
  } catch (error) {
    console.error('Error al editar stock:', error)
    toast.showToast('Error al editar stock', 'error')
  } finally {
    modal_edit_stock.value = false
    await fetchStocks()
    toast.showToast('Stock editado con éxito', 'success')
  }
}
async function deleteStock() {
  if (!confirm('¿Estás seguro de que deseas eliminar este almacén?')) return
  try {
    const { data, error } = await supabase
      .from('Stocks')
      .delete()
      .eq('id', form_edit_stock.value.id)
    if (error) throw error
  } catch (error) {
    console.error('Error al eliminar stock:', error)
    toast.showToast('Error al eliminar stock', 'error')
  } finally {
    modal_edit_stock.value = false
    await fetchStocks()
    toast.showToast('Stock eliminado con éxito', 'success')
  }
}

// 🔹 Cargar almacenes
async function fetchAlmacenes() {
  try {
    const { data, error } = await supabase
      .from('Almacenes')
      .select('*')
      .order('name', { ascending: true })
    if (error) throw error
    almacenes.value = data || []
  } catch (error) {
    console.error('Error al cargar almacenes:', error)
    toast.error('Error al cargar almacenes')
  }
}
// 🔹 Cargar stocks
async function fetchStocks() {
  try {
    const { data, error } = await supabase.from('Stocks').select('*')
    if (error) throw error
    stocks.value = data || []
  } catch (error) {
    console.error('Error al cargar stocks:', error)
    toast.error('Error al cargar stocks')
  }
}

// 🔹 Filtrar stocks por almacén
function getStocksByAlmacen(id_depot) {
  return stocks.value.filter((s) => s.almacen === id_depot)
}

onMounted(async () => {
  loading.value = true
  try {
    await fetchAlmacenes()

    await fetchStocks()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@import url('/src/assets/css/main.css');
</style>
