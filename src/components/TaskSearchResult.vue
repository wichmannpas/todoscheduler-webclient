<template>
  <div
      v-if="tasks.length > 0">
    <TaskList
        @editTask="editTask"
        @scheduleTask="scheduleTask"
        :tasks="tasks"
        :enableActions="enableActions" />
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
    'enableActions',
    'tasks'
  ],
  components: {
    TaskList
  },
  methods: {
    editTask (task) {
      this.$emit('editTask', task)
    },
    scheduleTask (task) {
      this.$emit('scheduleTask', task)
    }
  }
}
</script>
