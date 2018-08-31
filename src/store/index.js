import Vue from 'vue'
import Vuex from 'vuex'

import offlinePlugin from './offline'

import taskchunk from './taskchunk'
import task from './task'
import time from './time'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    taskchunk,
    task,
    time,
    user
  },
  plugins: [
    offlinePlugin
  ]
})
