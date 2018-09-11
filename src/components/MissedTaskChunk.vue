<template>
  <li
      @click="navigateToChunk"
      class="mdc-list-item">
    <span class="material-icons mdc-list-item__graphics">
      warning
    </span>
    <span class="mdc-list-item__text">
      <span class="mdc-list-item__primary-text">
        {{ chunk.task($store).name }}
      </span>
      <span class="mdc-list-item__secondary-text">
        scheduled for {{ chunk.naturalDay($store.state.time.today) }}
      </span>
    </span>
    <span class="mdc-list-item__meta">
      <a
          @click="finishChunk(chunk)"
          class="tooltip tooltip-left task-chunk-action"
          data-tooltip="Done">
        <i class="material-icons">
          check
        </i>
      </a>
      <a
          @click="postponeChunk(chunk)"
          class="tooltip tooltip-left task-chunk-action"
          data-tooltip="Postpone to another day">
        <i class="material-icons">
          watch_later
        </i>
      </a>
    </span>
  </li>
</template>

<script>
import { subDays } from 'date-fns'

import { deleteTaskChunk, finishTaskChunk } from '@/api/taskchunk'

export default {
  name: 'MissedTaskChunk',
  props: [
    'chunk'
  ],
  methods: {
    finishChunk (chunk) {
      finishTaskChunk(
        this.$store,
        chunk,
        true)
    },
    navigateToChunk (event) {
      if (
        event.target.classList.contains('task-chunk-action') ||
        event.target.parentElement.classList.contains('task-chunk-action') ||
        event.target.parentElement.parentElement.classList.contains('task-chunk-action') ||
        event.target.parentElement.parentElement.parentElement.classList.contains('task-chunk-action')
      ) {
        // another action button was clicked, do not navigate
        return
      }

      this.$store.dispatch('navigateToDay', subDays(this.chunk.day, 1))
      this.$store.dispatch('highlightChunk', this.chunk)
    },
    postponeChunk (chunk) {
      deleteTaskChunk(
        this.$store,
        this.chunk,
        true)
    }
  }
}
</script>
