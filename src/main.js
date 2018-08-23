import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import 'spectre.css/dist/spectre.css'

import '@/assets/scss/base.scss'
import '@/icons'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
