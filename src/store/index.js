import Vue from 'vue'
import Vuex from 'vuex'

import offlinePlugin from './offline'

import general from './general'
import label from './label'
import taskchunk from './taskchunk'
import taskchunkseries from './taskchunkseries'
import task from './task'
import time from './time'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    general,
    label,
    taskchunk,
    taskchunkseries,
    task,
    time,
    user
  },
  plugins: [
    offlinePlugin
  ]
})
