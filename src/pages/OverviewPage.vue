<template>
  <div class="overview">
    <NewTask />

    <MissedTaskChunks />

    <IncompleteTasks />

    <Schedule />
  </div>
</template>
<script>
import { checkAuth } from '@/api'
import IncompleteTasks from '@/components/IncompleteTasks'
import MissedTaskChunks from '@/components/MissedTaskChunks'
import NewTask from '@/components/NewTask'
import Schedule from '@/components/Schedule'

export default {
  name: 'OverviewPage',
  components: {
    NewTask,
    IncompleteTasks,
    MissedTaskChunks,
    Schedule
  },
  created: function () {
    checkAuth().then((auth) => {
      if (!auth) {
        this.$router.push('/login')
      }
    })
  }
}
</script>
