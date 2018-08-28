import axios from 'axios'
import { deserialize } from 'serializr'

import { API_URL } from '@/config'
import { ensureAuthToken, handleGenericErrors } from '@/api'
import { formatDayString } from '@/utils'
import Task from '@/models/Task'
import TaskChunk from '@/models/TaskChunk'

function fetchTasks () {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.get(API_URL + '/task/task/').then(function (response) {
      resolve(
        response.data.map(raw => deserialize(Task, raw)))
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function completeTask (store, task) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    let duration = task.duration.sub(task.unscheduledDuration())
    if (duration.toNumber() <= 0) {
      // unscheduled task, delete it
      axios.delete(API_URL + '/task/task/' + task.id.toString() + '/').then(function (response) {
        if (response.status === 204) {
          store.commit('deleteTask', task.id)

          resolve()
        } else {
          reject(response.data)
        }
      }).catch(error => handleGenericErrors(error, resolve, reject))
    } else {
      // update the task duration
      axios.patch(API_URL + '/task/task/' + task.id.toString() + '/', {
        duration: duration
      }).then(function (response) {
        if (response.status === 200) {
          store.commit('updateTask', deserialize(Task, response.data))
          resolve()
        } else {
          reject(response.data)
        }
      }).catch(error => handleGenericErrors(error, resolve, reject))
    }
  })
}

function scheduleTask (store, task, day, duration) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.post(API_URL + '/task/chunk/', {
      task_id: task.id,
      day: day,
      duration: duration
    }).then(function (response) {
      if (response.status === 201) {
        store.commit('updateTask', deserialize(Task, response.data.task))
        store.commit('addTaskChunk', deserialize(TaskChunk, response.data))

        resolve()
      } else {
        reject(response.data)
      }
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function createTask (store, task) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.post(API_URL + '/task/task/', {
      name: task.name,
      duration: task.duration,
      priority: task.priority,
      deadline: formatDayString(task.deadline),
      start: formatDayString(task.start)
    }).then(function (response) {
      if (response.status === 201) {
        let task = deserialize(Task, response.data)
        store.commit('addTask', task)
        resolve(task)
      } else {
        reject(response.data)
      }
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function updateTask (store, task) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.put(API_URL + '/task/task/' + task.id.toString() + '/', {
      name: task.name,
      duration: task.duration,
      priority: task.priority,
      deadline: formatDayString(task.deadline),
      start: formatDayString(task.start)
    }).then(function (response) {
      if (response.status === 200) {
        store.commit('updateTask', deserialize(Task, response.data))
        resolve()
      } else {
        reject(response.data)
      }
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function changeTaskDuration (store, task, newDuration) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.patch(API_URL + '/task/task/' + task.id.toString() + '/', {
      duration: newDuration
    }).then(function (response) {
      store.commit('updateTask', deserialize(Task, response.data))

      resolve()
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

export {
  changeTaskDuration,
  createTask,
  fetchTasks,
  completeTask,
  scheduleTask,
  updateTask
}
