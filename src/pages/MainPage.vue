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
import { fetchData } from '@/fetch'
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
    fetchData(this.$store, this.$router)
  }
}
</script>
