import Vue from 'vue'

import { addDays, isSameDay } from 'date-fns'
import Decimal from 'decimal.js-light'

import { fetchTaskChunks } from '@/api/taskchunk'
import { formatDayString, insertIndex, updateWithOrder } from '@/utils'

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
    /**
     * add specified task chunks, previously removing them if they exist
     */
    addUpdateTaskChunks (state, taskChunks) {
      taskChunks.forEach(taskChunk => {
        let index = state.taskChunks.findIndex(
          item => item.id === taskChunk.id)
        if (index >= 0) {
          Vue.delete(
            state.taskChunks,
            index)
        }

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
    }
  },
  actions: {
    fetchData ({ commit, dispatch, state }, today) {
      if (state.ready) {
        return
      }

      dispatch('fetchTaskChunks', {
        today: today
      })
    },
    /**
     * To filter the task chunk day range to fetch, either a minDate/maxDate
     * or the number of days to go into the past/future can be specified.
     *
     * If a minDate/maxDate is specified, this has precedence over
     * pastDays/futureDays.
     */
    fetchTaskChunks (
      { commit, state },
      { today, minDate, maxDate, pastDays, futureDays }
    ) {
      if (today === undefined) {
        today = new Date()
      }
      if (minDate === undefined) {
        if (pastDays === undefined) {
          pastDays = 1
        }
        minDate = addDays(today, -pastDays)
      }
      if (maxDate === undefined) {
        if (futureDays === undefined) {
          futureDays = 7
        }
        maxDate = addDays(today, futureDays)
      }

      fetchTaskChunks(
        formatDayString(minDate),
        formatDayString(maxDate)
      ).then(taskChunks => {
        commit('setTaskChunks', taskChunks)
      })
    }
  }
}
