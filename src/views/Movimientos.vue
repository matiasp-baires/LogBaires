<template>
  <!-- Loading -->
  <div
    v-if="loading || !load_content"
    class="d-flex justify-content-center align-items-center"
    style="height: 60vh"
  >
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>

  <div v-else class="container py-4">
    <!-- Header -->
    <div class="row mb-4">
      <h1 class="col-10">Movimientos</h1>
    </div>

    <section id="hdrj" v-if="can(['ADM', 'IT', 'HDRJ'])">
      <!-- Title -->
      <header class="row">
        <h2 class="col">HDRJ</h2>
        <button
          v-if="can(['ADM', 'IT', 'HDRJ', 'HBTJ', 'LOG'])"
          class="btn btn-success col-2 fw-medium"
          @click="openMovModal('hdrj')"
        >
          Mover stock
        </button>
      </header>

      <!-- Movimientos históricos -->
      <div class="table-responsive" id="hdrj_trace">
        <h3>Movimientos de Stock - HDRJ</h3>
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Origen</th>
              <th scope="col">Destino</th>
              <th scope="col">Creado por</th>
              <th scope="col">Entregado a</th>
              <th scope="col">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mov in movimientosHDRJ" :key="mov.id" @dblclick="openMovementDetail(mov)">
              <th scope="row">{{ mov.id.slice(0, 8) }}</th>
              <td>{{ getNombreAlmacen(mov.almacen1) }}</td>
              <td>{{ getNombreAlmacen(mov.almacen2) }}</td>
              <td>{{ getNombreJaver(mov.created_by) }}</td>
              <td>{{ getNombreJaver(mov.delivery_to) }}</td>
              <td>{{ formatDateTime(new Date(mov.created_at)) }}</td>
            </tr>
            <tr v-if="movimientosHDRJ.length === 0">
              <td colspan="6" class="text-center text-muted">Sin movimientos registrados</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Almacenes -->
      <aside v-if="can(['ADM', 'IT', 'HDRJ'])" class="row mb-4 accordion mt-3" id="almacenes1">
        <h3>Almacenes de HDRJ</h3>
        <div
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
        </div>
      </aside>
    </section>

    <hr class="my-4" />

    <section id="hbtj" v-if="can(['ADM', 'IT', 'HBTJ', 'LOG'])">
      <!-- Title -->
      <header class="row">
        <h2 class="col">LOG y HBTJ</h2>
        <button
          v-if="can(['ADM', 'IT', 'HDRJ', 'HBTJ', 'LOG'])"
          class="btn btn-success col-2 fw-medium"
          @click="openMovModal('log')"
        >
          Mover stock
        </button>
      </header>

      <!-- Movimientos históricos -->
      <div class="table-responsive" id="hbtj_trace">
        <h3>Movimientos de Stock</h3>
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Origen</th>
              <th scope="col">Destino</th>
              <th scope="col">Creado por</th>
              <th scope="col">Entregado a</th>
              <th scope="col">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mov in movimientosLog" :key="mov.id" @dblclick="openMovementDetail(mov)">
              <th scope="row">{{ mov.id.slice(0, 8) }}</th>
              <td>{{ getNombreAlmacen(mov.almacen1) }}</td>
              <td>{{ getNombreAlmacen(mov.almacen2) }}</td>
              <td>{{ getNombreJaver(mov.created_by) }}</td>
              <td>{{ getNombreJaver(mov.delivery_to) }}</td>
              <td>{{ formatDateTime(new Date(mov.created_at)) }}</td>
            </tr>
            <tr v-if="movimientosLog.length === 0">
              <td colspan="6" class="text-center text-muted">Sin movimientos registrados</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Almacenes -->
      <aside class="row mb-4 accordion mt-3" id="almacenes2">
        <h3>Almacenes</h3>
        <div
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
        </div>
      </aside>
    </section>

    <!-- Modals -->
    <Modal v-model="modal_log">
      <div class="container p-4">
        <h5>Mover objetos de Log y HBTJ</h5>
        <form class="row">
          <!-- Createds -->
          <div class="col-12 col-md-6">
            <label for="log_created_at" class="form-label">Creado a las</label>
            <input
              type="datetime-local"
              id="log_created_at"
              :placeholder="formatDateTime(new Date())"
              disabled
              v-model="mov_created_at"
              class="form-control"
            />
          </div>

          <div class="col-12 col-md-6 mb-3">
            <label for="log_created_by" class="form-label">Creado por</label>
            <input
              type="text"
              id="log_created_by"
              v-model="mov_created_by"
              disabled
              class="form-control"
              :placeholder="mov_created_by"
            />
          </div>

          <!-- Deliverys -->
          <div class="col-12 col-md-6">
            <label for="log_delivery_at" class="form-label">Entrega el</label>
            <input
              type="datetime-local"
              id="log_delivery_at"
              :placeholder="formatDateTime(new Date())"
              v-model="mov_delivery_at"
              class="form-control"
            />
          </div>

          <div class="col-12 col-md-6 mb-3">
            <label for="log_delivery_to" class="form-label">Entregado a</label>
            <select id="log_delivery_to" v-model="mov_delivery_to" class="form-select">
              <option :value="jvr.id_jvr" v-for="jvr in javerim" :key="jvr.id_jvr">
                {{ getJaver(jvr.dni) }}
              </option>
            </select>
          </div>

          <!-- Almacenes -->
          <div class="col-12 col-md-6">
            <label for="log_alm1" class="form-label">Almacén origen</label>
            <select
              class="form-select"
              v-model="mov_almacen1"
              required
              id="log_alm1"
              :disabled="mov_stocks_ids.length > 0"
            >
              <option :value="alm.id_depot" v-for="alm in almacenesLog">{{ alm.name }}</option>
            </select>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <label for="log_alm2" class="form-label">Almacén destino</label>
            <select class="form-select" v-model="mov_almacen2" required id="log_alm2">
              <option :value="alm.id_depot" v-for="alm in almacenesLog">{{ alm.name }}</option>
            </select>
          </div>

          <hr />

          <!-- Stocks -->
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col" style="width: 25px">#</th>
                <th scope="col">Producto</th>
                <th scope="col" colspan="2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="stk in getStocksByAlmacen(mov_almacen1)"
                :key="stk.id"
                class="align-center"
              >
                <td style="width: 50px">
                  <input
                    type="checkbox"
                    :value="stk.id"
                    v-model="mov_stocks_ids"
                    @change="updateMovStocks"
                  />
                </td>
                <td>{{ stk.alias }}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    :max="stk.cantidad"
                    v-model.number="mov_stocks_cants[stk.id]"
                    @input="updateMovStocks"
                    :disabled="!mov_stocks_ids.includes(stk.id)"
                    class="form-control"
                    style="width: 100px"
                    :class="{
                      'border-success border-2': mov_stocks_cants[stk.id] === stk.cantidad,
                      'border-danger border-2':
                        mov_stocks_cants[stk.id] === 0 || mov_stocks_cants[stk.id] === '0',
                    }"
                  />
                </td>
                <td class="text-muted">/ {{ stk.cantidad }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="table-secondary text-center">
                <td scope="col" class="fw-bold" colspan="2">Total de productos</td>
                <td scope="col" class="fw-bold" colspan="2">Total de unidades</td>
              </tr>
              <tr class="text-center border-top">
                <td class="fw-bold" colspan="2">{{ selectedItemsCount }}</td>
                <td class="fw-bold" colspan="2">{{ selectedUnitsTotal }}</td>
              </tr>
            </tfoot>
          </table>

          <hr />

          <!-- Botones de acción -->
          <div class="col-12 d-flex gap-2 justify-content-end">
            <button type="button" class="btn btn-secondary" @click="closeMovModal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="sendMovModal">
              Confirmar movimiento
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Modal HDRJ (similar a LOG pero con almacenes HDRJ) -->
    <Modal v-model="modal_hdrj">
      <div class="container p-4">
        <h5>Mover objetos de HDRJ</h5>
        <form class="row">
          <!-- Createds -->
          <div class="col-12 col-md-6">
            <label for="hdrj_created_at" class="form-label">Creado a las</label>
            <input
              type="datetime-local"
              id="hdrj_created_at"
              :placeholder="formatDateTime(new Date())"
              disabled
              v-model="mov_created_at"
              class="form-control"
            />
          </div>
          <div class="col-12 col-md-6 mb-3">
            <label for="hdrj_created_by" class="form-label">Creado por</label>
            <input
              type="text"
              id="hdrj_created_by"
              v-model="mov_created_by"
              disabled
              class="form-control"
              :placeholder="mov_created_by"
            />
          </div>

          <!-- Deliverys -->
          <div class="col-12 col-md-6">
            <label for="hdrj_delivery_at" class="form-label">Entrega el</label>
            <input
              type="datetime-local"
              id="hdrj_delivery_at"
              :placeholder="formatDateTime(new Date())"
              v-model="mov_delivery_at"
              class="form-control"
            />
          </div>
          <div class="col-12 col-md-6 mb-3">
            <label for="hdrj_delivery_to" class="form-label">Entregado a</label>
            <select id="hdrj_delivery_to" v-model="mov_delivery_to" class="form-select">
              <option :value="jvr.id_jvr" v-for="jvr in javerim" :key="jvr.id_jvr">
                {{ getJaver(jvr.dni) }}
              </option>
            </select>
          </div>

          <!-- Almacenes -->
          <div class="col-12 col-md-6">
            <label for="hdrj_alm1" class="form-label">Almacén origen</label>
            <select
              class="form-select"
              v-model="mov_almacen1"
              required
              id="hdrj_alm1"
              :disabled="mov_stocks_ids.length > 0"
            >
              <option :value="alm.id_depot" v-for="alm in almacenesHDRJ">{{ alm.name }}</option>
            </select>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <label for="hdrj_alm2" class="form-label">Almacén destino</label>
            <select class="form-select" v-model="mov_almacen2" required id="hdrj_alm2">
              <option :value="alm.id_depot" v-for="alm in almacenesHDRJ">{{ alm.name }}</option>
            </select>
          </div>

          <hr />

          <!-- Stocks (reusa la misma tabla/inputs que Log) -->
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col" style="width: 25px">#</th>
                <th scope="col">Producto</th>
                <th scope="col" colspan="2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="stk in getStocksByAlmacen(mov_almacen1)"
                :key="stk.id"
                class="align-center"
              >
                <td style="width: 50px">
                  <input
                    type="checkbox"
                    :value="stk.id"
                    v-model="mov_stocks_ids"
                    @change="updateMovStocks"
                  />
                </td>
                <td>{{ stk.alias }}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    :max="stk.cantidad"
                    v-model.number="mov_stocks_cants[stk.id]"
                    @input="updateMovStocks"
                    :disabled="!mov_stocks_ids.includes(stk.id)"
                    class="form-control"
                    style="width: 100px"
                    :class="{
                      'border-success border-2': mov_stocks_cants[stk.id] === stk.cantidad,
                      'border-danger border-2':
                        mov_stocks_cants[stk.id] === 0 || mov_stocks_cants[stk.id] === '0',
                    }"
                  />
                </td>
                <td class="text-muted text-start">/ {{ stk.cantidad }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="table-secondary text-center">
                <td scope="col" class="fw-bold" colspan="2">Total de productos</td>
                <td scope="col" class="fw-bold" colspan="2">Total de unidades</td>
              </tr>
              <tr class="text-center border-top">
                <td class="fw-bold" colspan="2">{{ selectedItemsCount }}</td>
                <td class="fw-bold" colspan="2">{{ selectedUnitsTotal }}</td>
              </tr>
            </tfoot>
          </table>

          <hr />

          <!-- Botones de acción -->
          <div class="col-12 d-flex gap-2 justify-content-end">
            <button type="button" class="btn btn-secondary" @click="closeMovModal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="sendMovModal">
              Confirmar movimiento
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Modal detalle movimiento -->
    <Modal v-model="modal_detail">
      <div class="container p-4">
        <h5>Detalle del movimiento {{ detailMov ? detailMov.id.slice(0, 8) : '' }}</h5>

        <div v-if="detailMov">
          <div class="row mb-2">
            <div class="col-6">
              <strong>Origen:</strong> {{ getNombreAlmacen(detailMov.almacen1) }}
            </div>
            <div class="col-6">
              <strong>Destino:</strong> {{ getNombreAlmacen(detailMov.almacen2) }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-6">
              <strong>Creado por:</strong> {{ getNombreJaver(detailMov.created_by) }}
            </div>
            <div class="col-6">
              <strong>Entregado a:</strong> {{ getNombreJaver(detailMov.delivery_to) }}
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-6">
              <strong>Fecha:</strong> {{ formatDateTime(new Date(detailMov.created_at)) }}
            </div>
            <div class="col-6 d-flex align-items-center">
              <label class="form-check-label me-2"><strong>Entregado:</strong></label>
              <input
                type="checkbox"
                :checked="detailMov.delivered"
                :disabled="currentJaverId !== detailMov.delivery_to"
                @change="toggleDelivered"
                class="form-check-input"
                role="switch"
              />
            </div>
          </div>

          <h6>Productos</h6>
          <table class="table table-sm">
            <thead>
              <tr>
                <th scope="col" style="width: 25px">#</th>
                <th scope="col">Alias</th>
                <th scope="col">Nombre</th>
                <th scope="col" class="text-end">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, idx) in detailProducts" :key="p.id || idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ p.alias || 'Eliminado' }}</td>
                <td>{{ p.nombre || '-' }}</td>
                <td class="text-end">{{ p.cantidad || 0 }}</td>
              </tr>
              <tr v-if="!detailProducts || detailProducts.length === 0">
                <td colspan="4" class="text-center text-muted">Sin productos disponibles</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="table-secondary text-center">
                <td scope="col" class="fw-bold" colspan="2">Total de productos</td>
                <td scope="col" class="fw-bold" colspan="2">Total de unidades</td>
              </tr>
              <tr class="text-center border-top">
                <td class="fw-bold">{{ detailItemsCount }}</td>
                <td class="fw-bold" colspan="3">{{ detailUnitsTotal }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary" @click="modal_detail = false">Cerrar</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import Modal from '../components/Modal.vue'
import toast from '@/stores/toast'
import { useRoles } from '@/services/roles'
import { formatDateTime } from '@/utils/formatDate'
import { getJaverFromSession, getJaver, initJaverCache } from '@/utils/getJaver'
const { loading, hasRole, hasAny, can } = useRoles()
const load_content = ref(false)

// Global Variables
const movimientos = ref([])
const movimientosHDRJ = computed(() => {
  return movimientos.value.filter((mov) => {
    const almOrigen = almacenes.value.find((a) => a.id_depot === mov.almacen1)
    if (!almOrigen) return false
    const cats = Array.isArray(almOrigen.category) ? almOrigen.category : [almOrigen.category]
    return cats.every((c) => c === 'HDRJ')
  })
})
const movimientosLog = computed(() => {
  return movimientos.value.filter((mov) => {
    const almOrigen = almacenes.value.find((a) => a.id_depot === mov.almacen1)
    if (!almOrigen) return false
    const cats = Array.isArray(almOrigen.category) ? almOrigen.category : [almOrigen.category]
    return !cats.includes('HDRJ')
  })
})
const stocks = ref([])
const javerim = ref([])
const almacenes = ref([])
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

// Fetching from Database
async function fetchMovimientos() {
  try {
    const { data, error } = await supabase
      .from('Movimientos')
      .select('*')
      .order('created_at', { ascending: false })
    movimientos.value = data
  } catch (error) {
    console.error('Error fetching movimientos:', error)
    toast.showToast('Error al cargar los movimientos: ' + error.message, 'error')
    return
  }
}
async function fetchStocks() {
  try {
    const { data, error } = await supabase.from('Stocks').select('*')
    stocks.value = data
  } catch (error) {
    console.error('Error fetching stocks:', error)
    toast.showToast('Error al cargar los stocks: ' + error.message, 'error')
    return
  }
}
async function fetchAlmacenes() {
  try {
    const { data, error } = await supabase
      .from('Almacenes')
      .select('*')
      .order('name', { ascending: true })
    almacenes.value = data
  } catch (error) {
    console.error('Error fetching almacenes:', error)
    toast.showToast('Error al cargar los almacenes: ' + error.message, 'error')
    return
  }
}
async function fetchJaverim() {
  try {
    const { data, error } = await supabase
      .from('Javerim')
      .select('*')
      .order('nombre', { ascending: true })
    javerim.value = data
  } catch (error) {
    console.error('Error fetching almacenes:', error)
    toast.showToast('Error al cargar los almacenes: ' + error.message, 'error')
    return
  }
}

function getStocksByAlmacen(id_depot) {
  return stocks.value.filter((s) => s.almacen === id_depot)
}

// Obtener nombre del almacén por ID
function getNombreAlmacen(id_depot) {
  const almacen = almacenes.value.find((a) => a.id_depot === id_depot)
  return almacen ? almacen.name : 'Desconocido'
}

// Obtener nombre del javer por ID
function getNombreJaver(id_jvr) {
  const javer = javerim.value.find((j) => j.id_jvr === id_jvr)
  if (!javer) return 'Desconocido'
  return javer.apodo ? javer.apodo : `${javer.nombre} ${javer.apellido}`
}

// === FORMS ===
const modal_log = ref(false)
const modal_hdrj = ref(false)
const mov_created_at = ref(null)
const mov_created_by = ref(null)
const mov_created_by_id = ref(null) // ID del javer que crea el movimiento
const mov_almacen1 = ref(null)
const mov_almacen2 = ref(null)
const mov_stocks = ref([]) // Array de objetos: { id_stock, cantidad }
const mov_stocks_ids = ref([]) // Array de ids seleccionados
const mov_stocks_cants = ref({}) // Objeto: { id_stock: cantidad }
const mov_delivery_to = ref(null)
const mov_delivery_at = ref(null)
const mov_delivered = ref(null)

// Detail modal & current user
const modal_detail = ref(false)
const detailMov = ref(null)
const detailProducts = ref([])
const currentJaverId = ref(null)

// Abrir modal detalle de movimiento y cargar productos (alias)
async function openMovementDetail(mov) {
  try {
    detailMov.value = mov
    modal_detail.value = true

    // Obtener aliases de los stocks listados en mov.stocks
    detailProducts.value = []
    if (Array.isArray(mov.stocks) && mov.stocks.length > 0) {
      // Traer alias, nombre y cantidad actuales (si existen)
      const { data, error } = await supabase
        .from('Stocks')
        .select('id, alias, nombre, cantidad')
        .in('id', mov.stocks)
      if (error) {
        console.error('Error fetching detail stocks:', error)
        detailProducts.value = []
      } else {
        // Map data preserving order of mov.stocks
        const byId = (data || []).reduce((acc, s) => ((acc[s.id] = s), acc), {})
        detailProducts.value = mov.stocks.map(
          (sid) => byId[sid] || { id: sid, alias: null, nombre: null, cantidad: 0 },
        )
      }
    }
  } catch (err) {
    console.error('openMovementDetail error:', err)
    toast.showToast('Error abriendo detalle: ' + err.message, 'error')
  }
}

// Toggle delivered (solo quien es delivery_to puede hacerlo)
async function toggleDelivered() {
  if (!detailMov.value) return
  try {
    if (currentJaverId.value !== detailMov.value.delivery_to) {
      toast.showToast('No estás autorizado para marcar la entrega', 'warning')
      return
    }

    const newVal = !detailMov.value.delivered
    const { error } = await supabase
      .from('Movimientos')
      .update({ delivered: newVal })
      .eq('id', detailMov.value.id)
    if (error) throw error

    // Actualizar en memoria y recargar movimientos
    detailMov.value.delivered = newVal
    await fetchMovimientos()
    toast.showToast('Estado de entrega actualizado', 'success')
  } catch (err) {
    console.error('toggleDelivered error:', err)
    toast.showToast('Error actualizando entrega: ' + err.message, 'error')
  }
}

function openMovModal(type) {
  switch (type) {
    case 'log':
      modal_log.value = true
      break
    case 'hdrj':
      modal_hdrj.value = true
      break
    default:
      toast.showToast('Tipo de movimiento no especificado', 'warning')
      break
  }

  mov_created_at.value = new Date().toISOString().slice(0, 16)
}

// Actualizar mov_stocks basado en ids y cantidades
function updateMovStocks() {
  mov_stocks.value = []
  mov_stocks_ids.value.forEach((stockId) => {
    const cantidad = mov_stocks_cants.value[stockId]
    if (stockId && cantidad && cantidad > 0) {
      mov_stocks.value.push({
        id_stock: stockId,
        cantidad: cantidad,
      })
    }
  })
}

function buildMovStocks() {
  updateMovStocks()
}

// Totales del formulario: cantidad de ítems seleccionados y suma de unidades
const selectedItemsCount = computed(() => mov_stocks_ids.value.length)
const selectedUnitsTotal = computed(() => {
  return mov_stocks_ids.value.reduce((sum, id) => {
    const v = Number(mov_stocks_cants.value[id] || 0)
    return sum + (isNaN(v) ? 0 : v)
  }, 0)
})

// Totales para modal detalle
const detailItemsCount = computed(() => detailProducts.value.length)
const detailUnitsTotal = computed(() => {
  return detailProducts.value.reduce((sum, p) => {
    const v = Number(p.cantidad || 0)
    return sum + (isNaN(v) ? 0 : v)
  }, 0)
})

// Procesar movimiento de stock
async function processMovimiento() {
  try {
    // Construir array de movimientos
    buildMovStocks()

    if (mov_stocks.value.length === 0) {
      toast.showToast('Debe seleccionar al menos un producto', 'warning')
      return
    }

    for (const item of mov_stocks.value) {
      const stockOrigen = stocks.value.find((s) => s.id === item.id_stock)
      if (!stockOrigen) {
        toast.showToast('Producto no encontrado', 'error')
        return
      }

      const cantidadAMover = item.cantidad
      const esMovimientoTotal = cantidadAMover === stockOrigen.cantidad

      // Buscar producto con mismo alias en almacén destino
      const productoEnDestino = stocks.value.find(
        (s) => s.almacen === mov_almacen2.value && s.alias === stockOrigen.alias,
      )

      if (productoEnDestino) {
        // Caso: Ya existe producto con mismo alias en destino
        // Sumar cantidad en destino
        const { error: updateError } = await supabase
          .from('Stocks')
          .update({ cantidad: productoEnDestino.cantidad + cantidadAMover })
          .eq('id', productoEnDestino.id)

        if (updateError) throw updateError

        // Restar cantidad en origen
        if (esMovimientoTotal) {
          // Si es movimiento total, borrar item
          const { error: deleteError } = await supabase
            .from('Stocks')
            .delete()
            .eq('id', stockOrigen.id)

          if (deleteError) throw deleteError
        } else {
          // Si no es total, solo restar
          const { error: updateError2 } = await supabase
            .from('Stocks')
            .update({ cantidad: stockOrigen.cantidad - cantidadAMover })
            .eq('id', stockOrigen.id)

          if (updateError2) throw updateError2
        }
      } else {
        // Caso: No existe producto con mismo alias en destino
        // Duplicar item sin id (para que se autogenere)
        const nuevoStock = {
          alias: stockOrigen.alias,
          nombre: stockOrigen.nombre,
          descripcion: stockOrigen.descripcion,
          categoria: stockOrigen.categoria,
          cantidad: cantidadAMover,
          almacen: mov_almacen2.value,
        }

        const { error: insertError } = await supabase.from('Stocks').insert([nuevoStock])

        if (insertError) throw insertError

        // Restar cantidad en origen
        if (esMovimientoTotal) {
          // Si es movimiento total, borrar item
          const { error: deleteError } = await supabase
            .from('Stocks')
            .delete()
            .eq('id', stockOrigen.id)

          if (deleteError) throw deleteError
        } else {
          // Si no es total, solo restar
          const { error: updateError } = await supabase
            .from('Stocks')
            .update({ cantidad: stockOrigen.cantidad - cantidadAMover })
            .eq('id', stockOrigen.id)

          if (updateError) throw updateError
        }
      }
    }

    // Guardar registro en tabla Movimientos
    const stockIds = mov_stocks.value.map((item) => item.id_stock)
    const { error: movError } = await supabase.from('Movimientos').insert([
      {
        created_by: mov_created_by_id.value,
        almacen1: mov_almacen1.value,
        almacen2: mov_almacen2.value,
        stocks: stockIds,
        delivery_to: mov_delivery_to.value,
        delivery_at: mov_delivery_at.value || null,
        delivered: mov_delivered.value || false,
      },
    ])

    if (movError) throw movError

    toast.showToast('Movimiento realizado correctamente', 'success')
    await fetchStocks()
    await fetchMovimientos()
    closeMovModal()
  } catch (error) {
    console.error('Error procesando movimiento:', error)
    toast.showToast('Error al procesar movimiento: ' + error.message, 'error')
  }
}

function resetMovForm() {
  mov_stocks.value = []
  mov_stocks_ids.value = []
  mov_stocks_cants.value = {}
  mov_almacen1.value = null
  mov_almacen2.value = null
  mov_delivery_to.value = null
  mov_delivery_at.value = null
}

function closeMovModal() {
  modal_log.value = false
  modal_hdrj.value = false
  resetMovForm()
}

function sendMovModal() {
  processMovimiento()
}

onMounted(async () => {
  load_content.value = false
  await fetchMovimientos()
  await fetchAlmacenes()
  await fetchStocks()
  await fetchJaverim()
  await initJaverCache()

  // Obtener javer de la sesión y asignar displayName a mov_created_by
  const javer = await getJaverFromSession()
  if (javer) {
    mov_created_by.value = javer.displayName
    mov_created_by_id.value = javer.id_jvr
    currentJaverId.value = javer.id_jvr
  }

  load_content.value = true
})
</script>
