import { dayOfDate } from '@/utils'

export default {
  state: {
    today: dayOfDate(new Date()),
    updateInterval: null
  },
  mutations: {
    setToday (state, today) {
      state.today = today
    },
    setTimeUpdateInterval (state, interval) {
      state.updateInterval = interval
    }
  },
  actions: {
    setTimeUpdateInterval ({ commit, dispatch, state }) {
      if (state.updateInterval !== null) {
        clearInterval(state.updateInterval)
      }

      let interval = setInterval(() => {
        dispatch('updateToday')
      }, 120000)

      commit('setTimeUpdateInterval', interval)
    },
    updateToday ({ commit, state }) {
      let today = dayOfDate(new Date())

      if (today.getTime() === state.today.getTime()) {
        return
      }

      commit('setToday', dayOfDate(new Date()))
    }
  }
}
