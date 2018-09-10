import axios from 'axios'
import { deserialize } from 'serializr'

import { API_URL } from '@/config'
import { ensureAuthToken, handleGenericErrors } from '@/api'
import Task from '@/models/Task'
import TaskChunk from '@/models/TaskChunk'
import TaskChunkSeries from '@/models/TaskChunkSeries'

function fetchTaskChunks (minDate, maxDate, taskId) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.get(API_URL + '/task/chunk/', {
      params: {
        min_date: minDate,
        max_date: maxDate,
        task_id: taskId
      }
    }).then(function (response) {
      resolve(
        response.data.map(raw => deserialize(TaskChunk, raw)))
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function deleteTaskChunk (store, chunk, postpone) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.delete(API_URL +
      '/task/chunk/' + chunk.id.toString() +
      '/?postpone=' + (postpone ? '1' : '0')).then(function (response) {
      store.commit('deleteTaskChunk', chunk.id)

      let task = chunk.task(store)
      task.scheduledDuration = task.scheduledDuration.sub(chunk.duration)
      if (!postpone) {
        task.duration = task.duration.sub(chunk.duration)
      }
      if (task.duration.comparedTo(0) > 0) {
        store.commit('updateTask', {
          task: task,
          today: store.state.time.today
        })
      } else {
        // no duration left, task was deleted
        store.commit('deleteTask', task.id)
      }

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function changeTaskChunkDuration (store, chunk, newDuration) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.patch(API_URL + '/task/chunk/' + chunk.id.toString() + '/', {
      duration: newDuration
    }).then(function (response) {
      store.commit('updateTaskChunk', {
        taskChunk: deserialize(TaskChunk, response.data),
        today: store.state.time.today
      })
      store.commit('updateTask', {
        task: deserialize(Task, response.data.task),
        today: store.state.time.today
      })

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function exchangeTaskChunk (store, chunk, exchange) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.patch(API_URL + '/task/chunk/' + chunk.id.toString() + '/', {
      day_order: exchange.dayOrder
    }).then(function (response) {
      store.commit('updateTaskChunk', {
        taskChunk: deserialize(TaskChunk, response.data),
        today: store.state.time.today
      })
      exchange.dayOrder = chunk.dayOrder
      store.commit('updateTaskChunk', {
        taskChunk: exchange,
        today: store.state.time.today
      })

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function finishTaskChunk (store, chunk, newState) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.patch(API_URL + '/task/chunk/' + chunk.id.toString() + '/', {
      finished: newState
    }).then(function (response) {
      store.commit('updateTaskChunk', {
        taskChunk: deserialize(TaskChunk, response.data),
        today: store.state.time.today
      })
      store.commit('updateTask', {
        task: deserialize(Task, response.data.task),
        today: store.state.time.today
      })

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function splitTaskChunk (store, chunk) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.post(
      API_URL + '/task/chunk/' + chunk.id.toString() + '/split/'
    ).then(function (response) {
      store.commit(
        'addUpdateTaskChunks',
        {
          taskChunks: response.data.map(raw => deserialize(TaskChunk, raw)),
          today: store.state.time.today
        })

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function updateTaskChunkDay (store, chunk, newDay) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.patch(API_URL + '/task/chunk/' + chunk.id.toString() + '/', {
      day: newDay
    }).then(function (response) {
      store.commit('updateTaskChunk', {
        taskChunk: deserialize(TaskChunk, response.data),
        today: store.state.time.today
      })

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function createTaskChunkSeries (store, task, data) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.post(API_URL + '/task/chunk/series/', {
      task_id: task.id,
      duration: data.duration,
      start: data.start,
      end: data.end,
      rule: data.rule,
      interval_days: data.intervalDays,
      monthly_day: data.monthlyDay,
      monthly_months: data.monthlyMonths,
      monthlyweekday_weekday: data.monthlyweekdayWeekday,
      monthlyweekday_nth: data.monthlyweekdayNth
    }).then(function (response) {
      if (response.status === 201) {
        let taskChunks = response.data.scheduled.map(raw => deserialize(TaskChunk, raw))

        if (taskChunks.length > 0) {
          store.commit('addUpdateTaskChunks', {
            taskChunks: taskChunks,
            today: store.state.time.today
          })

          // at least one new chunk was scheduled and the task updated
          // we extract the task from the first scheduled chunk and update it
          store.commit('updateTask', {
            task: task,
            today: store.state.time.today
          })
        }

        store.commit('addTaskChunkSeries', deserialize(TaskChunkSeries, response.data.series))

        resolve()
      } else {
        reject(response.data)
      }
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function fetchTaskChunkSeries () {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.get(API_URL + '/task/chunk/series/').then(function (response) {
      resolve(
        response.data.map(raw => deserialize(TaskChunkSeries, raw)))
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

export {
  changeTaskChunkDuration,
  createTaskChunkSeries,
  deleteTaskChunk,
  exchangeTaskChunk,
  fetchTaskChunks,
  fetchTaskChunkSeries,
  finishTaskChunk,
  splitTaskChunk,
  updateTaskChunkDay
}
