import { deserialize } from 'serializr'

import Task from '@/models/Task'
import TaskChunk from '@/models/TaskChunk'
import User from '@/models/User'

function persistUser (state) {
  if (state.ready !== true || state.authenticated !== true) {
    localStorage.removeItem('user')

    return
  }

  localStorage.setItem('user', JSON.stringify(state.user))
}

function restoreUser (store) {
  let user = JSON.parse(localStorage.getItem('user'))

  if (user === null) {
    return false
  }

  user.workhours_weekday = user.workhoursWeekday
  user.workhours_weekend = user.workhoursWeekend
  user.default_schedule_duration = user.defaultScheduleDuration
  user.default_schedule_full_duration_max = user.defaultScheduleFullDurationMax
  store.commit('setUser', deserialize(User, user))
  console.info('restored user from local storage')

  return true
}

function persistTasks (state) {
  if (state.ready !== true) {
    localStorage.removeItem('tasks')

    return
  }

  localStorage.setItem('tasks', JSON.stringify(state.tasks))
}

function loadPersistedTasks () {
  let tasks = JSON.parse(localStorage.getItem('tasks'))
  if (tasks === null) {
    return
  }

  return Object.values(tasks).map(task => {
    task.scheduled_duration = task.scheduledDuration
    task.finished_duration = task.finishedDuration
    return deserialize(Task, task)
  })
}

function restoreTasks (store) {
  let tasks = loadPersistedTasks()
  if (tasks !== undefined) {
    store.commit('setTasks', {
      tasks: tasks,
      today: store.state.time.today
    })
    console.info('restored tasks from local storage')
    return true
  }

  return false
}

function persistTaskChunks (state) {
  if (state.ready !== true) {
    localStorage.removeItem('taskchunks')

    return
  }

  localStorage.setItem('taskchunks', JSON.stringify(state.taskChunks))
}

function loadPersistedTaskChunks () {
  let taskChunks = JSON.parse(localStorage.getItem('taskchunks'))
  if (taskChunks === null) {
    return
  }

  return Object.values(taskChunks).map(
    taskchunk => {
      taskchunk.day_order = taskchunk.dayOrder
      taskchunk.task = {
        id: taskchunk.taskId
      }
      return deserialize(TaskChunk, taskchunk)
    })
}

function restoreTaskChunks (store) {
  let taskChunks = loadPersistedTaskChunks()
  if (taskChunks !== undefined) {
    store.commit('setTaskChunks', {
      taskChunks: taskChunks,
      today: store.state.time.today
    })
    console.info('restored task chunks from local storage')
    return true
  }
  return false
}

const offlinePlugin = store => {
  if (restoreUser(store)) {
    if (restoreTasks(store)) {
      restoreTaskChunks(store)
    }
  }

  store.subscribe(({ type }, state) => {
    if (type === 'reset') {
      localStorage.removeItem('user')
      localStorage.removeItem('tasks')
      localStorage.removeItem('taskchunks')
    } else if (type === 'setUser') {
      persistUser(state.user)
    } else if (type.toLowerCase().indexOf('taskchunk') >= 0) {
      persistTaskChunks(state.taskchunk)
    } else if (type.toLowerCase().indexOf('task') >= 0) {
      persistTasks(state.task)
    }
  })
}

export default offlinePlugin