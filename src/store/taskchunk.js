import Vue from 'vue'

import { isSameDay } from 'date-fns'
import Decimal from 'decimal.js-light'

import { fetchTaskChunks } from '@/api/taskchunk'
import { insertIndex, updateWithOrder } from '@/utils'

export default {
  state: {
    ready: false,
    taskChunks: []
  },
  getters: {
    finishedScheduledDurationForDay: (state, getters) => (day) =>
      getters.taskChunksForDay(day).filter(
        chunk => chunk.finished
      ).map(
        chunk => chunk.duration
      ).reduce(
        (a, b) => a.add(b),
        Decimal(0)
      ),
    scheduledDurationForDay: (state, getters) => (day) =>
      getters.taskChunksForDay(day).map(chunk => chunk.duration).reduce(
        (a, b) => a.add(b),
        Decimal(0)
      ),

    taskChunksForDay: (state) => (day) => state.taskChunks.filter(
      taskChunk => isSameDay(taskChunk.day, day)),
    taskChunkToExchange: (state, getters) => (chunk, direction) => {
      let dayChunks = getters.taskChunksForDay(chunk.day)

      let len = dayChunks.length
      for (let i = 0; i < len; i++) {
        let other = dayChunks[i]
        if (direction < 0) {
          other = dayChunks[len - i - 1]
        }

        if (other.finished !== chunk.finished) {
          continue
        }

        if (direction * other.dayOrder > direction * chunk.dayOrder) {
          return other
        }
      }
      return null
    },
    missedTaskChunks: (state) => state.taskChunks.filter(
      chunk => !chunk.finished && chunk.past())
  },
  mutations: {
    /**
     * requires no redundant taskChunks to be present
     */
    setTaskChunks (state, taskChunks) {
      state.taskChunks = []

      taskChunks.forEach(taskChunk => {
        state.taskChunks.splice(
          insertIndex(state.taskChunks, taskChunk),
          0,
          taskChunk
        )
      })

      state.ready = true
    },
    addTaskChunk (state, taskChunk) {
      if (state.taskChunks.findIndex(item => item.id === taskChunk.id) >= 0) {
        // task chunk exists already
        return
      }

      state.taskChunks.splice(
        insertIndex(state.taskChunks, taskChunk),
        0,
        taskChunk
      )
    },
    updateTaskChunk (state, taskChunk) {
      updateWithOrder(state.taskChunks, taskChunk)
    },
    deleteTaskChunk (state, taskChunkId) {
      Vue.delete(
        state.taskChunks,
        state.taskChunks.findIndex(
          item => item.id === taskChunkId))
    },
    updateTask (state, task) {
      state.taskChunks.forEach(taskChunk => {
        if (taskChunk.task.id !== task.id) {
          return
        }

        Vue.set(taskChunk, 'task', task)
      })
    }
  },
  actions: {
    fetchData ({ commit, state }) {
      if (state.ready) {
        return
      }

      fetchTaskChunks().then(taskChunks => {
        commit('setTaskChunks', taskChunks)
      })
    }
  }
}
