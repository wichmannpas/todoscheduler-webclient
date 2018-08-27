<template>
  <ul
      ref="list"
      class="mdc-list mdc-list--dense mdc-list--two-line"
      aria-orientation="vertical">
    <Task
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @scheduleTask="scheduleTask" />
  </ul>
</template>

<script>
import { list } from 'material-components-web'

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
      this.ui.list = new list.MDCList(this.$refs.list)
    }
  },
  methods: {
    scheduleTask (task) {
      this.$emit('scheduleTask', task)
    }
  }
}
</script>
