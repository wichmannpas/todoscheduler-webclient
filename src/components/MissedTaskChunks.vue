<template>
  <div
      v-if="ready">
    <div
        v-if="missedTaskChunks.length > 0"
        class="missed-task-chunks">
      You missed these task chunks!

      <MissedTaskChunkList
          :missedTaskChunks="missedTaskChunks" />
    </div>
  </div>
  <div
      v-else
      class="loading loading-lg">
  </div>
</template>

<script>
import MissedTaskChunkList from '@/components/MissedTaskChunkList'

import '@/assets/scss/missedTaskChunks.scss'

export default {
  name: 'MissedTaskChunks',
  components: {
    MissedTaskChunkList
  },
  computed: {
    ready () {
      return this.$store.state.task.ready
    },
    missedTaskChunks () {
      return this.$store.getters.missedTaskChunks(this.$store.state.time.today)
    }
  }
}
</script>
