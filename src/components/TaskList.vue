<template>
  <ul
      ref="list"
      class="mdc-list mdc-list--dense mdc-list--two-line"
      aria-orientation="vertical">
    <Task
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :enableActions="enableActions"
        @editTask="editTask"
        @scheduleTask="scheduleTask" />
  </ul>
</template>

<script>
import Task from '@/components/Task'

export default {
  name: 'TaskList',
  components: {
    Task
  },
  props: [
    'enableActions',
    'tasks'
  ],
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
