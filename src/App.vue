<template>
  <Navbar></Navbar>
  <router-view></router-view>
  <Toast
    :message="toast.state.message"
    :type="toast.state.type"
    :visible="toast.state.visible"
    @hide="toast.hideToast"
  />
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Toast from './components/Toast.vue'
import toast from './stores/toast'
import { useRoles } from '@/services/roles'
const { isGuest } = useRoles()
if (isGuest.value) {
  console.warn('The user is a guest (has no roles assigned).')
  toast.showToast('No estás validado, tendrás acceso restringido', 'info')
}
</script>
