import { reactive } from 'vue'

const state = reactive({
  visible: false,
  message: '',
  type: 'success', // 'success' | 'error' | 'info' | 'warning'
  timeout: null,
})

function showToast(message, type = 'success', duration = 3000) {
  state.message = message
  state.type = type
  state.visible = true
  if (state.timeout) clearTimeout(state.timeout)
  state.timeout = setTimeout(() => {
    state.visible = false
  }, duration)
}

function hideToast() {
  state.visible = false
  if (state.timeout) clearTimeout(state.timeout)
}

export default {
  state,
  showToast,
  hideToast,
}
