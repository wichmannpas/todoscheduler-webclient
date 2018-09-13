import Vue from 'vue'

import { deserialize } from 'serializr'

import { fetchTaskChunkSeries } from '@/api/taskchunk'
import Task from '@/models/Task'
import TaskChunk from '@/models/TaskChunk'

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
    },
    addRawTaskChunksFromSeries ({ commit, rootState }, responseData) {
      let newTaskChunks = responseData.scheduled.map(raw => deserialize(TaskChunk, raw))

      let task = deserialize(Task, responseData.task)
      commit('updateTask', {
        task: task,
        today: rootState.time.today
      })

      if (newTaskChunks.length > 0) {
        commit('addUpdateTaskChunks', {
          taskChunks: newTaskChunks,
          today: rootState.time.today
        })
      }

      if (responseData.cleaned !== undefined) {
        commit('deleteTaskChunks', responseData.cleaned)
      }
    }
  }
}
