<template>
  <div class="container-full">
    <Offline
        v-if="!$store.state.general.online" />

    <div class="mdc-layout-grid">
      <div class="mdc-layout-grid__inner">
        <div
            class="
              task-cell
              mdc-layout-grid__cell
              mdc-layout-grid__cell--span-3-desktop
              mdc-layout-grid__cell--span-12-tablet
              mdc-layout-grid__cell--span-12-phone">
          <MissedTaskChunks />

          <Tasks />
        </div>
        <div
            class="
              schedule-cell
              mdc-layout-grid__cell
              mdc-layout-grid__cell--span-9-desktop
              mdc-layout-grid__cell--span-12-tablet
              mdc-layout-grid__cell--span-12-phone">
          <Schedule />
        </div>
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
      fetchUser().then(user => {
        this.$store.commit('setUser', user)

        // fetch remaining data
        this.$store.dispatch('fetchData')
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
</script>
