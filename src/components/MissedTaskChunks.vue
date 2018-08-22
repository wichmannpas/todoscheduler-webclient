<template>
  <div
      v-if="missedTaskChunks.length > 0"
      class="toast toast-warning">
    There are unfinished scheduled tasks for past days!

    <ul>
      <li
          v-for="chunk in missedTaskChunks"
          v-bind:key="chunk.id">
          {{ chunk.task.name }} ({{ chunk.naturalDay() }})
          <a
              @click="finishChunk(chunk)"
              class="tooltip"
              data-tooltip="Done">
            <span class="fa fa-check"></span></a>
          <a
              @click="postponeChunk(chunk)"
              class="tooltip"
              data-tooltip="Postpone to another day">
            <span class="fa fa-clock-o"></span></a>
      </li>
    </ul>
  </div>
</template>

<script>
import { deleteTaskChunk, finishTaskChunk } from '@/api/taskchunk'

export default {
  name: 'MissedTaskChunks',
  created: function () {
    // TODO: adapt to new API
    // Api.getMissedTaskChunks(this.$store)
  },
  computed: {
    missedTaskChunks () {
      return this.$store.getters.missedTaskChunks
    }
  },
  methods: {
    finishChunk (chunk) {
      finishTaskChunk(
        this.$store,
        chunk,
        true)
    },
    postponeChunk (chunk) {
      deleteTaskChunk(
        this.$store,
        chunk,
        true)
    }
  }
}
</script>
