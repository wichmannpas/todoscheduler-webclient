import Decimal from 'decimal.js-light'
import Vue from 'vue'

import { deserialize } from 'serializr'

import { fetchTaskChunkSeries } from '@/api/taskchunk'
import Task from '@/models/Task'
import TaskChunk from '@/models/TaskChunk'
import TaskChunkSeries from '@/models/TaskChunkSeries'

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
      let updatedTask = false

      let newTaskChunks = responseData.scheduled.map(raw => deserialize(TaskChunk, raw))

      let task

      if (newTaskChunks.length > 0) {
        commit('addUpdateTaskChunks', {
          taskChunks: newTaskChunks,
          today: rootState.time.today
        })

        // at least one new chunk was scheduled and the task updated
        // we extract the task from the first scheduled chunk and update it
        task = deserialize(Task, responseData.scheduled[0].task)
        commit('updateTask', {
          task: task,
          today: rootState.time.today
        })
        updatedTask = true
      }

      if (responseData.cleaned !== undefined) {
        let series = deserialize(TaskChunkSeries, responseData.series)

        if (!updatedTask) {
          task = rootState.task.tasks[responseData.series.task_id]
          // reduce the duration of the task by the duration of the cleaned task chunks
          let reducedDuration = Decimal(0)
          responseData.cleaned.forEach(chunkId => {
            let chunk = rootState.taskchunk.taskChunks[chunkId]
            let duration
            if (chunk === undefined) {
              console.warn('cleaned task chunk which we do not now, assuming default duration')
              duration = series.duration
            } else {
              duration = chunk.duration
            }
            reducedDuration = reducedDuration.add(duration)
          })
          task.duration = task.duration.sub(reducedDuration)
          commit('updateTask', {
            task: task,
            today: rootState.time.today
          })
        }

        commit('deleteTaskChunks', responseData.cleaned)
      }
    }
  }
}
