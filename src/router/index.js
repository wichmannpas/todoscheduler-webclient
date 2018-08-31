import Vue from 'vue'
import VueRouter from 'vue-router'

import LandingPage from '@/pages/LandingPage'
import LegalStatement from '@/pages/LegalStatement'
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
      path: '/legal',
      name: 'legalStatement',
      component: LegalStatement
    }
  ]
})
