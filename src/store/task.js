import Vue from 'vue'

import { fetchTasks } from '@/api/task'
import { insertIndex } from '@/utils'

export default {
  state: {
    ready: false,
    fetched: false,
    tasks: {},
    taskOrder: []
  },
  getters: {
    orderedTasks: state => state.taskOrder.map(taskId => state.tasks[taskId]),

    completelyScheduledTasks: (state, getters) => getters.orderedTasks.filter(
      task => task.completelyScheduled()),
    incompletelyScheduledTasks: (state, getters) => getters.orderedTasks.filter(
      task => !task.completelyScheduled()),

    activeTasks: (state, getters) => getters.completelyScheduledTasks.filter(task => !task.finished()),
    finishedTasks: (state, getters) => getters.completelyScheduledTasks.filter(task => task.finished()),
    futureTasks: (state, getters) => today => getters.incompletelyScheduledTasks.filter(task => task.startInFuture(today)),
    openTasks: (state, getters) => today => getters.incompletelyScheduledTasks.filter(task => !task.startInFuture(today)),

    filteredTasks: (state, getters) => filter => getters.orderedTasks.filter(task => task.matchesFilter(filter))
  },
  mutations: {
    reset (state) {
      state.ready = false
      state.fetched = false
    },
    setTasksFetched (state) {
      state.fetched = true
    },
    /**
     * requires no redundant tasks to be present
     */
    setTasks (state, { tasks, today }) {
      state.tasks = {}
      state.taskOrder = []

      tasks.forEach(task => {
        Vue.set(state.tasks, task.id, task)
      })
      // we need to iterate over the tasks a second time to ensure that the index
      // is fully populated
      tasks.forEach(task => {
        state.taskOrder.splice(
          insertIndex(state.taskOrder, task, state.tasks, today),
          0,
          task.id
        )
      })

      state.ready = true
    },
    addTask (state, { task, today }) {
      if (state.tasks[task.id] !== undefined) {
        // task exists already
        return
      }

      state.taskOrder.splice(
        insertIndex(state.taskOrder, task, state.tasks, today),
        0,
        task.id)
      Vue.set(state.tasks, task.id, task)
    },
    updateTask (state, { task, today }) {
      Vue.set(
        state.tasks,
        task.id,
        task)

      let orderIndex = state.taskOrder.indexOf(task.id)
      if (insertIndex(state.taskOrder, task, state.tasks, today) !== orderIndex + 1) {
        // affects ordering, update taskOrder
        Vue.delete(
          state.taskOrder,
          orderIndex)
        state.taskOrder.splice(
          insertIndex(state.taskOrder, task, state.tasks, today),
          0,
          task.id)
      }
    },
    deleteTask (state, taskId) {
      Vue.delete(
        state.taskOrder,
        state.taskOrder.indexOf(taskId))
      Vue.delete(
        state.tasks,
        taskId)
    }
  },
  actions: {
    fetchData ({ commit, rootState, state }, options) {
      if (options === undefined) {
        options = {}
      }

      if (state.ready && state.fetched && options.ignoreReady !== true) {
        return
      }

      fetchTasks().then(tasks => {
        commit('setTasks', {
          tasks: tasks,
          today: rootState.time.today
        })
        commit('setTasksFetched')
      })
    }
  }
}
