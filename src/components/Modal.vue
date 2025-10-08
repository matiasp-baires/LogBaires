<template>
  <transition name="modal-slide">
    <div v-if="modelValue" class="modal-slide">
      <!-- Contenido -->
      <div class="modal-content">
        <button class="btn btn-close close-btn" @click="closeModal" aria-label="Cerrar"></button>
        <slot></slot>
      </div>

      <!-- Backdrop -->
      <div class="modal-backdrop" @click="closeModal"></div>
    </div>
  </transition>
</template>

<script setup>
import { toRefs, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
})
const { modelValue } = toRefs(props)
const emit = defineEmits(['update:modelValue'])

function closeModal() {
  emit('update:modelValue', false)
}

// Función para cerrar al ESC
function handleEsc(event) {
  if (event.key === 'Escape' && modelValue.value) {
    closeModal()
  }
}

// Escuchar y limpiar eventos según el estado del modal
watch(modelValue, (open) => {
  if (open) {
    window.addEventListener('keydown', handleEsc)
  } else {
    window.removeEventListener('keydown', handleEsc)
  }
})

// Asegurar limpieza si el componente se destruye
onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.modal-slide {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
}

.modal-content {
  width: 50%;
  height: 100%;
  padding: 0;
  position: relative;
  animation: slideInRight 0.3s;
  box-shadow: none;
  border-radius: 1rem !important;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #fff;
  z-index: 1200;
}

/* 🔥 Nuevo: hacer que el form y container ocupen todo */
.modal-content > form {
  height: 100% !important;
  overflow-y: scroll;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 50vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  z-index: 900;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2000;
}

/* Transición para el modal */
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.modal-slide-enter-from,
.modal-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.modal-slide-enter-to,
.modal-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* RESPONSIVE */
@media (max-width: 991.98px) {
  .modal-slide {
    justify-content: center;
    align-items: flex-end;
  }

  .modal-content {
    width: 100% !important;
    max-width: 100vw;
    height: 80vh;
    max-height: 80vh;
    border-radius: 1rem 1rem 0 0;
    animation: slideInBottom 0.3s;
    overflow-y: auto;
    z-index: 1000;
  }

  .modal-content:first-child {
    width: 100vw;
    position: absolute;
  }

  .close-btn {
    top: 0.75rem;
    right: 1rem;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100vh !important;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 500;
  }

  .modal-slide-enter-from,
  .modal-slide-leave-to {
    opacity: 0;
    transform: translateY(100%);
  }

  .modal-slide-enter-to,
  .modal-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animations */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes slideInBottom {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}
</style>
