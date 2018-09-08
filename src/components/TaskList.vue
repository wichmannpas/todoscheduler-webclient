<template>
  <ul
      ref="list"
      class="mdc-list mdc-list--dense mdc-list--two-line"
      aria-orientation="vertical">
    <Task
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @editTask="editTask"
        @scheduleTask="scheduleTask" />
  </ul>
</template>

<script>
import { MDCList } from '@material/list'

import Task from '@/components/Task'

export default {
  name: 'TaskList',
  components: {
    Task
  },
  props: [
    'tasks'
  ],
  data: function () {
    return {
      ui: {
        list: null
      }
    }
  },
  mounted: function () {
    if (this.ui.list === null) {
      this.ui.list = new MDCList(this.$refs.list)
    }
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
