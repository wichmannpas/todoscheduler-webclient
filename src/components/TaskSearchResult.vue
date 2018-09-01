<template>
  <div
      v-if="tasks.length > 0">
    <TaskList
        :tasks="tasks" />
  </div>
  <div v-else>
    <em>
      No matching tasks.
    </em>
  </div>
</template>

<script>
import TaskList from '@/components/TaskList'

export default {
  name: 'TaskSearchResult',
  props: [
    'tasks'
  ],
  components: {
    TaskList
  }
}
</script>
