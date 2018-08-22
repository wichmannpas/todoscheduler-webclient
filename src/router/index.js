import Vue from 'vue'
import VueRouter from 'vue-router'

import Imprint from '@/pages/Imprint'
import LoginPage from '@/pages/LoginPage'
import MainPage from '@/pages/MainPage'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/imprint',
      name: 'imprint',
      component: Imprint
    }
  ]
})
