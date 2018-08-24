import Vue from 'vue'

import { fetchTasks } from '@/api/task'
import { insertIndex } from '@/utils'

export default {
  state: {
    ready: false,
    tasks: {},
    taskOrder: []
  },
  getters: {
    orderedTasks: (state) => state.taskOrder.map(taskId => state.tasks[taskId]),
    incompletelyScheduledTasks: (state, getters) => getters.orderedTasks.filter(
      task => task.incompletelyScheduled())
  },
  mutations: {
    /**
     * requires no redundant tasks to be present
     */
    setTasks (state, tasks) {
      state.tasks = {}
      state.taskOrder = []

      tasks.forEach(task => {
        Vue.set(state.tasks, task.id, task)
      })
      // we need to iterate over the tasks a second time to ensure that the index
      // is fully populated
      tasks.forEach(task => {
        state.taskOrder.splice(
          insertIndex(state.taskOrder, task, state.tasks),
          0,
          task.id
        )
      })

      state.ready = true
    },
    addTask (state, task) {
      if (state.tasks[task.id] !== undefined) {
        // task exists already
        return
      }

      state.taskOrder.splice(
        insertIndex(state.taskOrder, task, state.tasks),
        0,
        task.id)
      Vue.set(state.tasks, task.id, task)
    },
    updateTask (state, task) {
      Vue.set(
        state.tasks,
        task.id,
        task)

      let orderIndex = state.taskOrder.indexOf(task.id)
      if (insertIndex(state.taskOrder, task, state.tasks) !== orderIndex + 1) {
        // affects ordering, update taskOrder
        Vue.delete(
          state.taskOrder,
          orderIndex)
        state.taskOrder.splice(
          insertIndex(state.taskOrder, task, state.tasks),
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
    fetchData ({ commit, state }) {
      if (state.ready) {
        return
      }

      fetchTasks().then(tasks => {
        commit('setTasks', tasks)
      })
    }
  }
}
