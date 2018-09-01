<template>
  <div>
    <Offline
        v-if="!$store.state.general.online" />

    <div class="main-content">
      <div
          class="tasks">
        <MissedTaskChunks />

        <Tasks />
      </div>
      <div
          class="schedule">
        <Schedule />
      </div>
    </div>
  </div>
</template>
<script>
import { fetchUser } from '@/api/user'
import MissedTaskChunks from '@/components/MissedTaskChunks'
import Offline from '@/components/Offline'
import Schedule from '@/components/Schedule'
import Tasks from '@/components/Tasks'

import '@/assets/scss/main.scss'

export default {
  name: 'MainPage',
  components: {
    MissedTaskChunks,
    Offline,
    Schedule,
    Tasks
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      let delayedFetch = true

      if (this.$store.state.user.ready === true) {
        // the user has been fetched since the last page load, the data
        // relying on can be fetched immediately
        this.$store.dispatch('fetchData')
        delayedFetch = false
      }

      if (this.$store.state.user.fetched !== true) {
        // the user has not been fetched yet, fetch it
        fetchUser().then(user => {
          this.$store.commit('setUser', user)
          this.$store.commit('setUserFetched', user)

          if (delayedFetch) {
            // fetch remaining data
            this.$store.dispatch('fetchData')
          }
        }).catch(error => {
          if (error.message === 'no auth') {
            this.$router.replace({
              name: 'landing'
            })
          } else {
            throw error
          }
        })
      }
    }
  }
}
</script>
