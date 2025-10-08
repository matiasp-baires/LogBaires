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
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import Toast from './components/Toast.vue'
import toast from './stores/toast'

const auth = useAuthStore()
auth.fetchUser()
auth.listenToAuth()
</script>

<style scoped></style>
