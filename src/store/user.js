export default {
  state: {
    ready: false,
    fetched: false,
    authenticated: false,
    user: null
  },
  mutations: {
    reset (state) {
      state.ready = false
      state.fetched = false
      state.authenticated = false
    },
    setUser (state, user) {
      state.user = user
      state.authenticated = true
      state.ready = true
    },
    setUserFetched (state) {
      state.fetched = true
    }
  }
}
