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
import { showSnackbar } from '@/snackbar'

export default {
  name: 'Sync',
  methods: {
    sync () {
      showSnackbar({
        message: 'Synchronizing now ...'
      })

      this.$store.dispatch('updateToday')

      fetchUser().then(user => {
        this.$store.commit('setUser', user)
        this.$store.commit('setUserFetched', user)
      })

      this.$store.dispatch('fetchData', {
        today: this.$store.state.time.today,
        ignoreReady: true
      })
    }
  }
}
</script>
