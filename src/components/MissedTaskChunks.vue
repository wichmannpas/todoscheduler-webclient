<template>
  <div
      v-if="ready">
    <div
        v-if="missedTaskChunks.length > 0"
        class="toast toast-warning">
      There are unfinished scheduled tasks for past days!

      <ul>
        <li
            v-for="chunk in missedTaskChunks"
            v-bind:key="chunk.id">
            {{ chunk.task($store).name }} ({{ chunk.naturalDay() }})
            <a
                @click="finishChunk(chunk)"
                class="tooltip"
                data-tooltip="Done">
              <font-awesome-icon
                  icon="check" />
            </a>
            <a
                @click="postponeChunk(chunk)"
                class="tooltip"
                data-tooltip="Postpone to another day">
              <font-awesome-icon
                  :icon="['far', 'clock']" />
            </a>
        </li>
      </ul>
    </div>
  </div>
  <div
      v-else
      class="loading loading-lg">
  </div>
</template>

<script>
import { deleteTaskChunk, finishTaskChunk } from '@/api/taskchunk'

export default {
  name: 'MissedTaskChunks',
  computed: {
    ready () {
      return this.$store.state.task.ready
    },
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
