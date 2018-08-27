<template>
  <div
      v-if="ready">
    <NewTask />

    <MissedTaskChunks />

    <IncompletelyScheduledTasks />
  </div>
  <Loading
      v-else />
</template>

<script>
import IncompletelyScheduledTasks from '@/components/IncompletelyScheduledTasks'
import Loading from '@/components/Loading'
import MissedTaskChunks from '@/components/MissedTaskChunks'
import NewTask from '@/components/NewTask'

export default {
  name: 'Tasks',
  components: {
    IncompletelyScheduledTasks,
    Loading,
    MissedTaskChunks,
    NewTask
  },
  computed: {
    ready () {
      return this.$store.state.task.ready
    }
  }
}
</script>
