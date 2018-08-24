import Vue from 'vue'

import { fetchTasks } from '@/api/task'
import { insertIndex, updateWithOrder } from '@/utils'

export default {
  state: {
    ready: false,
    tasks: []
  },
  getters: {
    taskById: state => taskId => state.tasks.find(task => task.id === taskId),
    incompletelyScheduledTasks: (state) => state.tasks.filter(task => task.incompletelyScheduled())
  },
  mutations: {
    /**
     * requires no redundant tasks to be present
     */
    setTasks (state, tasks) {
      state.tasks = []

      tasks.forEach(task => {
        state.tasks.splice(
          insertIndex(state.tasks, task),
          0,
          task
        )
      })

      state.ready = true
    },
    addTask (state, task) {
      if (state.tasks.findIndex(item => item.id === task.id) >= 0) {
        // task exists already
        return
      }

      state.tasks.splice(
        insertIndex(state.tasks, task),
        0,
        task)
    },
    updateTask (state, task) {
      updateWithOrder(state.tasks, task)
    },
    deleteTask (state, taskId) {
      Vue.delete(
        state.tasks,
        state.tasks.findIndex(
          item => item.id === taskId))
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
