import axios from 'axios'
import { deserialize } from 'serializr'

import { API_URL } from '@/config'
import { ensureAuthToken, handleGenericErrors } from '@/api'
import Task from '@/models/Task'
import TaskChunk from '@/models/TaskChunk'

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
      if (postpone) {
        let task = chunk.task
        task.scheduledDuration = task.scheduledDuration.sub(chunk.duration)
        store.commit('updateTask', task)
      }

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function changeTaskChunkDuration (store, chunk, newDuration) {
  return new Promise(function (resolve, reject) {
    axios.patch(API_URL + '/task/chunk/' + chunk.id.toString() + '/', {
      duration: newDuration
    }).then(function (response) {
      store.commit('updateTaskChunk', deserialize(TaskChunk, response.data))
      store.commit('updateTask', deserialize(Task, response.data.task))

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function exchangeTaskChunk (store, chunk, exchange) {
  return new Promise(function (resolve, reject) {
    axios.patch(API_URL + '/task/chunk/' + chunk.id.toString() + '/', {
      day_order: exchange.dayOrder
    }).then(function (response) {
      store.commit('updateTaskChunk', deserialize(TaskChunk, response.data))
      exchange.dayOrder = chunk.dayOrder
      store.commit('updateTaskChunk', exchange)

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function finishTaskChunk (store, chunk, newState) {
  return new Promise(function (resolve, reject) {
    axios.patch(API_URL + '/task/chunk/' + chunk.id.toString() + '/', {
      finished: newState
    }).then(function (response) {
      store.commit('updateTaskChunk', deserialize(TaskChunk, response.data))
      store.commit('updateTask', deserialize(Task, response.data.task))

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function splitTaskChunk (store, chunk) {
  return new Promise(function (resolve, reject) {
    axios.post(
      API_URL + '/task/chunk/' + chunk.id.toString() + '/split/'
    ).then(function (response) {
      store.commit(
        'addUpdateTaskChunks',
        response.data.map(raw => deserialize(TaskChunk, raw)))

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function updateTaskChunkDay (store, chunk, newDay) {
  return new Promise(function (resolve, reject) {
    axios.patch(API_URL + '/task/chunk/' + chunk.id.toString() + '/', {
      day: newDay
    }).then(function (response) {
      store.commit('updateTaskChunk', deserialize(TaskChunk, response.data))

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

export {
  changeTaskChunkDuration,
  deleteTaskChunk,
  exchangeTaskChunk,
  fetchTaskChunks,
  finishTaskChunk,
  splitTaskChunk,
  updateTaskChunkDay
}
