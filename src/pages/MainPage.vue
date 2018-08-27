<template>
  <div class="container-full">
    <div class="mdc-layout-grid">
      <div class="mdc-layout-grid__inner">
        <div
            class="
              task-cell
              mdc-layout-grid__cell
              mdc-layout-grid__cell--span-3-desktop
              mdc-layout-grid__cell--span-12-tablet
              mdc-layout-grid__cell--span-12-phone">
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
import Tasks from '@/components/Tasks'
import Schedule from '@/components/Schedule'

export default {
  name: 'MainPage',
  components: {
    Schedule,
    Tasks
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      if (!this.$store.state.user.ready) {
        fetchUser().then(user => {
          this.$store.commit('setUser', user)

          // fetch remaining data
          // TODO: supply today from store
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
}
</script>
