<template>
  <a
      @click="sync"
      class="material-icons mdc-top-app-bar__action-item"
      aria-label="Synchronize now"
      alt="Synchronize now"
    >refresh</a>
</template>

<script>
import { fetchUser } from '@/api/user'

export default {
  name: 'Sync',
  methods: {
    sync () {
      fetchUser().then(user => {
        this.$store.commit('setUser', user)
      })

      // TODO: supply today from store
      this.$store.dispatch('fetchData', { ignoreReady: true })
    }
  }
}
</script>
