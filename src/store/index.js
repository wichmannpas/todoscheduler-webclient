import Vue from 'vue'
import Vuex from 'vuex'

import taskchunk from './taskchunk'
import task from './task'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    taskchunk,
    task,
    user
  }
})
