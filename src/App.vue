<template>
  <Navbar></Navbar>
  <router-view></router-view>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
const auth = useAuthStore()
auth.fetchUser()
auth.listenToAuth()
</script>

<style scoped></style>
