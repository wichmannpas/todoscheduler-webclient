import Vue from 'vue'

import { fetchLabels } from '@/api/label'
import { insertIndex } from '@/utils'

export default {
  state: {
    ready: false,
    fetched: false,
    labels: {},
    labelOrder: []
  },
  getters: {
    orderedLabels: state => state.labelOrder.map(labelId => state.labels[labelId])
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
      state.labels = {}
      state.labelOrder = []

      labels.forEach(label => {
        Vue.set(state.labels, label.id, label)
      })
      // we need to iterate over the labels a second time to ensure that the index
      // is fully populated
      labels.forEach(label => {
        state.labelOrder.splice(
          insertIndex(state.labelOrder, label, state.labels),
          0,
          label.id
        )
      })

      state.ready = true
    },
    addLabel (state, label) {
      if (state.labels[label.id] !== undefined) {
        // label exists already
        return
      }

      state.labelOrder.splice(
        insertIndex(state.labelOrder, label, state.labels),
        0,
        label.id)
      Vue.set(state.labels, label.id, label)
    },
    updateLabel (state, label) {
      Vue.set(
        state.labels,
        label.id,
        label)

      let orderIndex = state.labelOrder.indexOf(label.id)
      if (insertIndex(state.labelOrder, label, state.labels) !== orderIndex + 1) {
        // affects ordering, update labelOrder
        Vue.delete(
          state.labelOrder,
          orderIndex)
        state.labelOrder.splice(
          insertIndex(state.labelOrder, label, state.labels),
          0,
          label.id)
      }
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
