import Vue from 'vue'
import VueRouter from 'vue-router'

import LandingPage from '@/pages/LandingPage'
import DataPrivacyStatement from '@/pages/DataPrivacyStatement'
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
      path: '/dataPrivacy',
      name: 'dataPrivacyStatement',
      component: DataPrivacyStatement
    },
    {
      path: '/legal',
      name: 'legalStatement',
      component: LegalStatement
    }
  ]
})
