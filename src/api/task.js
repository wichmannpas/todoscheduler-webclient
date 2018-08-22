import axios from 'axios'

import { API_URL } from '@/config'

import { ensureAuthToken, handleGenericErrors } from '@/api'

function fetchTasks (store) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.get(API_URL + '/task/task/').then(function (response) {
      // TODO: deserialize
      store.dispatch('setIncompleteTasks', response.data)
    }).catch((error) => handleGenericErrors(error))
  })
}

function finishTask (store, task) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    let duration = task.duration.sub(task.incompleteDuration())
    if (duration.toNumber() <= 0) {
      // unscheduled task, delete it
      axios.delete(API_URL + '/task/task/' + task.id.toString() + '/').then(function (response) {
        if (response.status === 204) {
          store.commit('deleteIncompleteTask', task)

          resolve()
        } else {
          reject(response.data)
        }
      }).catch(function (error) {
        console.error(error)
        reject(error.response.data)
      })
    } else {
      // update the task duration
      axios.patch(API_URL + '/tasks/task/' + task.id.toString() + '/', {
        duration: duration
      }).then(function (response) {
        if (response.status === 200) {
          store.dispatch('updateTask', response.data)
          store.dispatch('updateTaskInExecutions', response.data)
          resolve()
        } else {
          reject(response.data)
        }
      }).catch((error) => handleGenericErrors(error, resolve, reject))
    }
  })
}

function scheduleTask (store, task, day, duration) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.post(API_URL + '/tasks/taskexecution/', {
      task_id: task.id,
      day: day,
      duration: duration
    }).then(function (response) {
      if (response.status === 201) {
        store.dispatch('updateTask', response.data.task)
        store.dispatch('addTaskExecution', response.data)

        resolve()
      } else {
        reject(response.data)
      }
    }).catch((error) => handleGenericErrors(error, resolve, reject))
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
      start: task.start
    }).then(function (response) {
      if (response.status === 201) {
        store.commit('addIncompleteTask', response.data)
        resolve(response.data)
      } else {
        reject(response.data)
      }
    }).catch((error) => handleGenericErrors(error, resolve, reject))
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
      start: task.start
    }).then(function (response) {
      if (response.status === 200) {
        store.dispatch('updateTask', response.data)
        store.dispatch('updateTaskInExecutions', response.data)
        resolve()
      } else {
        reject(response.data)
      }
    }).catch((error) => handleGenericErrors(error, resolve, reject))
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
      store.dispatch('updateTask', response.data)
      store.dispatch('updateTaskInExecutions', response.data)

      resolve()
    }).catch((error) => handleGenericErrors(error, resolve, reject))
  })
}

export {
  changeTaskDuration,
  createTask,
  fetchTasks,
  finishTask,
  scheduleTask,
  updateTask
}
