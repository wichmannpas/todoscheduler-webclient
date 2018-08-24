<template>
  <div>
    <NewTask />

    <MissedTaskChunks />

    <IncompletelyScheduledTasks />

    <Schedule />

    <Logout />
  </div>
</template>
<script>
import { fetchUser } from '@/api/user'
import IncompletelyScheduledTasks from '@/components/IncompletelyScheduledTasks'
import MissedTaskChunks from '@/components/MissedTaskChunks'
import NewTask from '@/components/NewTask'
import Logout from '@/components/Logout'
import Schedule from '@/components/Schedule'

export default {
  name: 'MainPage',
  components: {
    IncompletelyScheduledTasks,
    Logout,
    MissedTaskChunks,
    NewTask,
    Schedule
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
              name: 'login'
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
