import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'
import Sign_ResetPassword from '@/views/Sign_ResetPassword.vue'
import Javer from '@/views/Javer.vue'
import Javerim from '@/views/Javerim.vue'
import Almacenes from '@/views/Almacenes.vue'
import Stock from '@/views/Stock.vue'
import Hdrj_Espacios from '@/views/Hdrj_Espacios.vue'
import Hdrj_Instituciones from '@/views/Hdrj_Instituciones.vue'
import Movimientos from '@/views/Movimientos.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/reset-password',
      name: 'Reset Password',
      component: Sign_ResetPassword,
    },
    {
      path: '/javer/:dni',
      name: 'javer',
      component: Javer,
    },
    {
      path: '/javerim',
      name: 'Javerim',
      component: Javerim,
    },
    {
      path: '/almacenes',
      name: 'almacenes',
      component: Almacenes,
    },
    {
      path: '/stock/',
      name: 'stock',
      component: Stock,
    },
    {
      path: '/movimientos/',
      name: 'movimientos',
      component: Movimientos,
    },
    {
      path: '/hdrj_espacios/',
      name: 'hdrj_espacios',
      component: Hdrj_Espacios,
    },
    {
      path: '/hdrj_instituciones',
      name: 'hdrj_instituciones',
      component: Hdrj_Instituciones,
    },
  ],
})

export default router
