<template>
  <div
      v-if="missedTaskExecutions.length > 0"
      class="toast toast-warning">
    There are unfinished scheduled tasks for past days!

    <ul>
      <li
          v-for="execution in missedTaskExecutions"
          v-bind:key="execution.id">
          {{ execution.task.name }} ({{ execution.naturalDay() }})
          <a
              @click="finishExecution(execution)"
              class="tooltip"
              data-tooltip="Done">
            <span class="fa fa-check"></span></a>
          <a
              @click="postponeExecution(execution)"
              class="tooltip"
              data-tooltip="Postpone to another day">
            <span class="fa fa-clock-o"></span></a>
      </li>
    </ul>
  </div>
</template>

<script>
import { deleteTaskChunk, finishTaskChunk } from '@/api/taskChunk'

export default {
  name: 'MissedTaskExecutions',
  created: function () {
    // TODO: adapt to new API
    // Api.getMissedTaskExecutions(this.$store)
  },
  computed: {
    missedTaskExecutions () {
      return this.$store.getters.missedTaskExecutions
    }
  },
  methods: {
    finishExecution (execution) {
      finishTaskChunk(
        this.$store,
        execution,
        true)
    },
    postponeExecution (execution) {
      deleteTaskChunk(
        this.$store,
        execution,
        true)
    }
  }
}
</script>
