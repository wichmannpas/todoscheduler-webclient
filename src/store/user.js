export default {
  state: {
    ready: false,
    user: null
  },
  mutations: {
    reset (state) {
      state.ready = false
    },
    setUser (state, user) {
      state.user = user
      state.ready = true
    }
  }
}
