import Vue from 'vue'

import { Day } from '@/models/Day'
import { objectToTask } from '@/models/Task'
import { objectToTaskChunk } from '@/models/TaskChunk'
import { formatDayString, parseDayString } from '@/utils'

/**
 * Determine the index at which to insert a new task chunk
 */
function taskChunkIndex (taskChunkList, newTaskChunk) {
  let index = 0
  for (let i = 0; i < taskChunkList.length; i++) {
    let chunk = taskChunkList[i]

    if (newTaskChunk.finished && !chunk.finished) {
      break
    }
    if ((!chunk.finished || newTaskChunk.finished) &&
        chunk.dayOrder > newTaskChunk.dayOrder) {
      break
    }

    index++
  }

  return index
}

export default {
  state: {
    days: {},
    missed: []
  },
  getters: {
    taskChunksForDay (state) {
      return day => {
        let dayString = formatDayString(day)
        let storedDay = state.days[dayString]
        let chunks = []
        let maxDuration = 0
        if (storedDay !== undefined) {
          return storedDay
        }

        // not stored, empty day
        console.warn('day ' + dayString + ' not in store')
        return new Day(
          day,
          maxDuration,
          chunks)
      }
    },
    taskChunkToExchange (state) {
      return (chunk, direction) => {
        let dayString = formatDayString(chunk.day)
        let storedDay = state.days[dayString]
        if (storedDay === undefined) {
          return null
        }

        let exchange = null
        for (let i = 0; i < storedDay.taskChunks.length; i++) {
          let other = storedDay.taskChunks[i]

          if (other.finished !== chunk.finished) {
            continue
          }

          if (exchange !== null &&
              direction * exchange.dayOrder < direction * other.dayOrder) {
            break
          }

          if (direction * other.dayOrder > direction * chunk.dayOrder) {
            exchange = other
          }
        }
        return exchange
      }
    },
    missedTaskChunks (state) {
      return state.missed
    }
  },
  mutations: {
    setTaskChunksForDay (state, payload) {
      let chunks = []
      for (let i = 0; i < payload.chunks.length; i++) {
        let chunk = payload.chunks[i]
        chunks.push(objectToTaskChunk(chunk))
      }

      let day = new Day(
        parseDayString(payload.day),
        payload.max_duration,
        chunks)

      Vue.set(state.days, payload.day, day)
    },
    /**
     * Delete a task chunk.
     *
     * Iterate through all days to ensure it is deleted
     * from a previous day if the day has been changed.
     *
     * Furthermore, delete it from missed.
     */
    deleteTaskChunk (state, chunk) {
      // days
      for (let dayString in state.days) {
        if (!state.days.hasOwnProperty(dayString)) {
          continue
        }
        let day = state.days[dayString]

        for (let i = 0; i < day.taskChunks.length; i++) {
          let other = day.taskChunks[i]

          if (chunk.id === other.id) {
            Vue.delete(day.taskChunks, i)
          }
        }
      }

      // missed
      for (let i = 0; i < state.missed.length; i++) {
        let other = state.missed[i]
        if (other.id === chunk.id) {
          Vue.delete(state.missed, i)
          break
        }
      }
    },
    addTaskChunkToDay (state, payload) {
      let chunk = objectToTaskChunk(payload)

      let dayString = formatDayString(chunk.day)
      let day = state.days[dayString]
      if (day === undefined) {
        console.warn(
          'not adding task chunk ' + chunk.id.toString() +
          ' to store because day ' + dayString + ' is not yet known')
        return
      }

      let index = taskChunkIndex(day.taskChunks, chunk)
      day.taskChunks.splice(index, 0, chunk)
    },
    addMissedTaskChunk (state, payload) {
      state.missed.push(payload)
    },
    setMissedTaskChunks (state, payload) {
      state.missed = []
      for (let i = 0; i < payload.length; i++) {
        let chunk = payload[i]
        state.missed.push(objectToTaskChunk(chunk))
      }
    }
  },
  actions: {
    /**
     * Add a task chunk to the proper day.
     *
     * If it is in past and not finished, it is added
     * to missed as well.
     */
    addTaskChunk (context, chunk) {
      chunk = objectToTaskChunk(chunk)

      context.commit('addTaskChunkToDay', chunk)

      // missed
      if (chunk.missed()) {
        context.commit('addMissedTaskChunk', chunk)
      }
    },
    /**
     * Update a task in all chunks that reference it.
     */
    updateTaskInChunks (context, payload) {
      let task = objectToTask(payload)

      // TODO: use commit instead of doing direct modifications

      // days
      for (let dayString in context.state.days) {
        if (!context.state.days.hasOwnProperty(dayString)) {
          continue
        }
        let day = context.state.days[dayString]

        for (let i = 0; i < day.taskChunks.length; i++) {
          let chunk = day.taskChunks[i]

          if (chunk.task.id === task.id) {
            Vue.set(chunk, 'task', task)
          }
        }
      }

      // missed
      for (let i = 0; i < context.state.missed.length; i++) {
        let chunk = context.state.missed[i]
        if (chunk.task.id === task.id) {
          Vue.set(chunk, 'task', task)
          break
        }
      }
    },
    updateTaskChunk (context, payload) {
      let chunk = objectToTaskChunk(payload)

      context.commit('deleteTaskChunk', chunk)

      // days
      context.commit('addTaskChunkToDay', chunk)

      // missed
      if (chunk.missed()) {
        context.commit('addMissedTaskChunk', chunk)
      }
    }
  }
}
