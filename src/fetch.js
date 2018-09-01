import { fetchUser } from '@/api/user'

/**
 * Fetch the data taking care of the inter-dependencies.
 */
function fetchData (store, router) {
  let delayedFetch = true

  if (store.state.user.ready === true) {
    // the user has been fetched since the last page load, the data
    // relying on can be fetched immediately
    store.dispatch('fetchData')
    delayedFetch = false
  }

  if (store.state.user.fetched !== true) {
    // the user has not been fetched yet, fetch it
    fetchUser().then(user => {
      store.commit('setUser', user)
      store.commit('setUserFetched', user)

      if (delayedFetch) {
        // fetch remaining data
        store.dispatch('fetchData')
      }
    }).catch(error => {
      if (error.message === 'no auth') {
        router.replace({
          name: 'landing'
        })
      } else {
        throw error
      }
    })
  }
}

export {
  fetchData
}
