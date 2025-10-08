<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
    <div
      v-if="visible"
      class="toast align-items-center text-white border-0 show"
      :class="toastClass"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ message }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
          @click="hideToast"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'success', // 'success' | 'error' | 'info' | 'warning'
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    toastClass() {
      switch (this.type) {
        case 'success':
          return 'bg-success'
        case 'error':
          return 'bg-danger'
        case 'info':
          return 'bg-info'
        case 'warning':
          return 'bg-warning'
        default:
          return 'bg-secondary'
      }
    },
  },
  methods: {
    hideToast() {
      this.$emit('hide')
    },
  },
}
</script>

<style scoped>
.toast-container {
  min-width: 300px;
}
</style>
