<template>
  <div
      v-if="ready">
    <NewTask />

    <MissedTaskChunks />

    <IncompletelyScheduledTasks />

    <Schedule />
  </div>
  <div
      v-else
      class="loading loading-lg">
  </div>
</template>
<script>
import { fetchUser } from '@/api/user'
import IncompletelyScheduledTasks from '@/components/IncompletelyScheduledTasks'
import MissedTaskChunks from '@/components/MissedTaskChunks'
import NewTask from '@/components/NewTask'
import Schedule from '@/components/Schedule'

export default {
  name: 'MainPage',
  components: {
    NewTask,
    IncompletelyScheduledTasks,
    MissedTaskChunks,
    Schedule
  },
  created: function () {
    this.fetchData()
  },
  computed: {
    ready () {
      return this.$store.state.user.ready &&
        this.$store.state.task.ready &&
        this.$store.state.taskchunk.ready
    }
  },
  methods: {
    fetchData () {
      if (!this.$store.state.user.ready) {
        fetchUser().then(user => {
          this.$store.commit('setUser', user)

          // fetch remaining data
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
