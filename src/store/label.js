import Vue from 'vue'

import { fetchLabels } from '@/api/label'

export default {
  state: {
    ready: false,
    fetched: false,
    labels: []
  },
  mutations: {
    reset (state) {
      state.ready = false
      state.fetched = false
    },
    setLabelsFetched (state) {
      state.fetched = true
    },
    /**
     * requires no redundant labels to be present
     */
    setLabels (state, labels) {
      state.labels = labels.sort((a, b) => a.compareTo(b))
      state.ready = true
    },
    addLabel (state, label) {
      state.labels.push(label)
      state.labels = state.labels.sort((a, b) => a.compareTo(b))
    },
    deleteLabel (state, label) {
      Vue.delete(
        state.labels,
        state.labels.findIndex(lab => lab.title === label.title)
      )
    }
  },
  actions: {
    fetchData ({ commit, rootState, state }, options) {
      if (options === undefined) {
        options = {}
      }

      if (state.ready && state.fetched && options.ignoreReady !== true) {
        return
      }

      fetchLabels().then(labels => {
        commit('setLabels', labels)
        commit('setLabelsFetched')
      })
    }
  }
}
