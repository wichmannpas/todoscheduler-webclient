import Vue from 'vue'
import Vuex from 'vuex'

import tasks from './tasks'
import taskchunks from './taskchunks'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tasks,
    taskchunks
  }
})
