import Vue from 'vue'
import VueRouter from 'vue-router'

import DataPrivacyStatement from '@/pages/DataPrivacyStatement'
import LandingPage from '@/pages/LandingPage'
import LegalStatement from '@/pages/LegalStatement'
import MainPage from '@/pages/MainPage'
import UserSettings from '@/pages/UserSettings'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage
    },
    {
      path: '/landing',
      name: 'landing',
      component: LandingPage
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
    },
    {
      path: '/settings',
      name: 'userSettings',
      component: UserSettings
    }
  ]
})
