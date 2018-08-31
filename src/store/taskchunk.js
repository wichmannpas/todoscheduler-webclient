import Vue from 'vue'

import { addDays, subDays } from 'date-fns'
import Decimal from 'decimal.js-light'

import { fetchTaskChunks } from '@/api/taskchunk'
import { formatDayString, insertIndex } from '@/utils'

export default {
  state: {
    firstDisplayedDay: null,
    ready: false,
    taskChunks: {},
    dayOrders: {},
    highlightedChunks: {}
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

    taskChunksForDay: (state) => (day) => {
      let dayChunks = state.dayOrders[formatDayString(day)]

      if (dayChunks === undefined) {
        return []
      }

      return dayChunks.map(id => state.taskChunks[id])
    },
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
    missedTaskChunks: (state) => today => Object.values(state.taskChunks).filter(
      chunk => !chunk.finished && chunk.past(today))
  },
  mutations: {
    reset (state) {
      state.ready = false
    },
    /**
     * requires no redundant taskChunks to be present
     */
    setTaskChunks (state, { taskChunks, today }) {
      state.taskChunks = {}
      state.dayOrders = {}

      taskChunks.forEach(taskChunk => {
        Vue.set(state.taskChunks, taskChunk.id, taskChunk)
      })
      // we need to iterate over the task chunks a second time to ensure that
      // the index is fully populated
      taskChunks.forEach(taskChunk => {
        let day = formatDayString(taskChunk.day)
        if (state.dayOrders[day] === undefined) {
          Vue.set(state.dayOrders, day, [])
        }

        state.dayOrders[day].splice(
          insertIndex(state.dayOrders[day], taskChunk, state.taskChunks, today),
          0,
          taskChunk.id
        )
      })

      state.ready = true
    },
    /**
     * add specified task chunks, previously removing them if they exist
     */
    addUpdateTaskChunks (state, { taskChunks, today }) {
      taskChunks.forEach(taskChunk => {
        let oldTaskChunk = state.taskChunks[taskChunk.id]

        if (oldTaskChunk !== undefined) {
          let oldDay = formatDayString(oldTaskChunk.day)
          Vue.delete(
            state.dayOrders[oldDay],
            state.dayOrders[oldDay].indexOf(oldTaskChunk.id))
        }

        Vue.set(
          state.taskChunks,
          taskChunk.id,
          taskChunk)

        let day = formatDayString(taskChunk.day)
        if (state.dayOrders[day] === undefined) {
          Vue.set(state.dayOrders, day, [])
        }
        state.dayOrders[day].splice(
          insertIndex(state.dayOrders[day], taskChunk, state.taskChunks, today),
          0,
          taskChunk.id
        )
      })

      state.ready = true
    },
    addTaskChunk (state, { taskChunk, today }) {
      if (state.taskChunks[taskChunk.id] !== undefined) {
        // task chunk exists already
        return
      }

      Vue.set(
        state.taskChunks,
        taskChunk.id,
        taskChunk)

      let day = formatDayString(taskChunk.day)
      if (state.dayOrders[day] === undefined) {
        Vue.set(state.dayOrders, day, [])
      }
      state.dayOrders[day].splice(
        insertIndex(state.dayOrders[day], taskChunk, state.taskChunks, today),
        0,
        taskChunk.id
      )
    },
    updateTaskChunk (state, { taskChunk, today }) {
      let oldTaskChunk = state.taskChunks[taskChunk.id]
      let oldDay = formatDayString(oldTaskChunk.day)
      Vue.delete(
        state.dayOrders[oldDay],
        state.dayOrders[oldDay].indexOf(oldTaskChunk.id))

      Vue.set(
        state.taskChunks,
        taskChunk.id,
        taskChunk)

      let day = formatDayString(taskChunk.day)
      if (state.dayOrders[day] === undefined) {
        Vue.set(state.dayOrders, day, [])
      }
      state.dayOrders[day].splice(
        insertIndex(state.dayOrders[day], taskChunk, state.taskChunks, today),
        0,
        taskChunk.id
      )
    },
    deleteTaskChunk (state, taskChunkId) {
      let taskChunk = state.taskChunks[taskChunkId]

      if (taskChunk === undefined) {
        console.warn('could not delete task chunk as it does not exist')
        return
      }

      let day = formatDayString(taskChunk.day)
      if (state.dayOrders[day] !== undefined) {
        Vue.delete(
          state.dayOrders[day],
          state.dayOrders[day].indexOf(taskChunkId))
      }

      Vue.delete(
        state.taskChunks,
        taskChunkId)
    },
    setFirstDisplayedDay (state, day) {
      Vue.set(state, 'firstDisplayedDay', day)
    },
    setChunkHighlight (state, { chunk, highlighted }) {
      Vue.set(state.highlightedChunks, chunk.id, highlighted)
    }
  },
  actions: {
    fetchData ({ commit, dispatch, rootState, state }, options) {
      if (options === undefined) {
        options = {}
      }

      if (state.ready && options.ignoreReady !== true) {
        return
      }

      dispatch('fetchTaskChunks', {
        today: rootState.time.today
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
      { today, minDate, maxDate, pastDays, futureDays, incremental }
    ) {
      let firstDay = state.firstDisplayedDay
      if (firstDay === null) {
        firstDay = subDays(today, 1)
      }

      if (minDate === undefined) {
        if (pastDays === undefined) {
          pastDays = 1
        }
        minDate = subDays(firstDay, pastDays)
      }
      if (maxDate === undefined) {
        if (futureDays === undefined) {
          futureDays = 8
        }
        maxDate = addDays(firstDay, futureDays)
      }

      fetchTaskChunks(
        formatDayString(minDate),
        formatDayString(maxDate)
      ).then(taskChunks => {
        if (incremental !== true) {
          commit('setTaskChunks', {
            taskChunks: taskChunks,
            today: today
          })
        } else {
          commit('addUpdateTaskChunks', {
            taskChunks: taskChunks,
            today: today
          })
        }
      })
    },
    navigateToDay ({ commit, dispatch, rootState }, day) {
      commit('setFirstDisplayedDay', day)
      dispatch('fetchTaskChunks', {
        incremental: true,
        today: rootState.time.today
      })
    },
    highlightChunk ({ commit }, chunk) {
      commit('setChunkHighlight', {
        chunk: chunk,
        highlighted: true
      })
      setTimeout(function () {
        commit('setChunkHighlight', {
          chunk: chunk,
          highlighted: false
        })
      }, 3000)
    }
  }
}
