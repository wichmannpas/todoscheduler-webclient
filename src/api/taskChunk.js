import axios from 'axios'

import { API_URL } from '@/config'

import { ensureAuthToken, handleGenericErrors } from '@/api'

function fetchTaskChunks (store) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    // TODO: adapt to new API

    axios.get(API_URL + '/task/chunk/').then(function (response) {
      for (let i = 0; i < response.data.length; i++) {
        store.commit('setTaskChunksForDay', response.data[i])
      }
    }).catch((error) => handleGenericErrors(error, resolve, reject))
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
      store.commit('deleteTaskChunk', chunk)
      if (postpone) {
        let task = chunk.task
        task.scheduledDuration = task.scheduledDuration.sub(chunk.duration)
        store.dispatch('updateTask', task)
        store.dispatch('updateTaskInChunks', task)
      }

      resolve()
    }).catch((error) => handleGenericErrors(error, resolve, reject))
  })
}

function changeTaskChunkDuration (store, chunk, newDuration) {
  return new Promise(function (resolve, reject) {
    axios.patch(API_URL + '/task/chunk/' + chunk.id.toString() + '/', {
      duration: newDuration
    }).then(function (response) {
      store.dispatch('updateTaskChunk', response.data)
      store.dispatch('updateTask', response.data.task)
      store.dispatch('updateTaskInChunks', response.data.task)

      resolve()
    })
  })
}

function exchangeTaskChunk (store, chunk, exchange) {
  return new Promise(function (resolve, reject) {
    axios.patch(API_URL + '/tasks/chunk/' + chunk.id.toString() + '/', {
      day_order: exchange.dayOrder
    }).then(function (response) {
      store.dispatch('updateTaskChunk', response.data)
      exchange.dayOrder = chunk.dayOrder
      store.dispatch('updateTaskChunk', exchange)

      resolve()
    })
  })
}

function finishTaskChunk (store, chunk, newState) {
  return new Promise(function (resolve, reject) {
    axios.patch(API_URL + '/task/chunk/' + chunk.id.toString() + '/', {
      finished: newState
    }).then(function (response) {
      store.dispatch('updateTaskChunk', response.data)
      store.dispatch('updateTask', response.data.task)
      store.dispatch('updateTaskInChunks', response.data.task)

      resolve()
    })
  })
}

function updateTaskChunkDay (store, chunk, newDay) {
  return new Promise(function (resolve, reject) {
    axios.patch(API_URL + '/task/chunk/' + chunk.id.toString() + '/', {
      day: newDay
    }).then(function (response) {
      store.dispatch('updateTaskChunk', response.data)

      resolve()
    })
  })
}

export {
  changeTaskChunkDuration,
  deleteTaskChunk,
  exchangeTaskChunk,
  fetchTaskChunks,
  finishTaskChunk,
  updateTaskChunkDay
}
