import Vue from 'vue'

import { fetchTaskChunkSeries } from '@/api/taskchunk'

export default {
  state: {
    ready: false,
    fetched: false,
    taskChunkSeries: {}
  },
  mutations: {
    reset (state) {
      state.ready = false
      state.fetched = false
    },
    setTaskChunkSeriesFetched (state) {
      state.fetched = true
    },
    setTaskChunkSeries (state, taskChunkSeries) {
      Vue.set(
        state, 'taskChunkSeries',
        {})

      taskChunkSeries.forEach(taskChunkSeries => {
        Vue.set(state.taskChunkSeries, taskChunkSeries.id, taskChunkSeries)
      })

      state.ready = true
    },
    addTaskChunkSeries (state, taskChunkSeries) {
      Vue.set(
        state.taskChunkSeries,
        taskChunkSeries.id,
        taskChunkSeries)
    }
  },
  actions: {
    fetchData ({ dispatch, state }, options) {
      if (options === undefined) {
        options = {}
      }

      if (state.ready && state.fetched && options.ignoreReady !== true) {
        return
      }

      dispatch('fetchTaskChunkSeries')
    },
    fetchTaskChunkSeries ({ commit, state }) {
      fetchTaskChunkSeries().then(taskChunkSeries => {
        commit('setTaskChunkSeries', taskChunkSeries)
        commit('setTaskChunkSeriesFetched')
      })
    }
  }
}
