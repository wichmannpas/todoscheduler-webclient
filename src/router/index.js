import Vue from 'vue'
import VueRouter from 'vue-router'

import Imprint from '@/pages/Imprint'
import LandingPage from '@/pages/LandingPage'
import MainPage from '@/pages/MainPage'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/main',
      name: 'main',
      component: MainPage
    },
    {
      path: '/imprint',
      name: 'imprint',
      component: Imprint
    }
  ]
})
