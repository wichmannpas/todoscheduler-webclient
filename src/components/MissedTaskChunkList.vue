<template>
  <ul
      ref="list"
      class="mdc-list mdc-list--dense mdc-list--two-line">
    <li
        v-for="chunk in missedTaskChunks"
        :key="chunk.id"
        class="mdc-list-item">
      <span class="material-icons mdc-list-item__graphics">
        warning
      </span>
      <span class="mdc-list-item__text">
        <span class="mdc-list-item__primary-text">
          {{ chunk.task($store).name }}
        </span>
        <span class="mdc-list-item__secondary-text">
          scheduled for {{ chunk.naturalDay() }}
        </span>
      </span>
      <span class="mdc-list-item__meta">
        <a
            @click="finishChunk(chunk)"
            class="tooltip tooltip-left"
            data-tooltip="Done">
          <font-awesome-icon
              icon="check" />
        </a>
        <a
            @click="postponeChunk(chunk)"
            class="tooltip tooltip-left"
            data-tooltip="Postpone to another day">
          <font-awesome-icon
              :icon="['far', 'clock']" />
        </a>
      </span>
    </li>
  </ul>
</template>

<script>
import { list } from 'material-components-web'

import { deleteTaskChunk, finishTaskChunk } from '@/api/taskchunk'

export default {
  name: 'MissedTaskChunkList',
  props: [
    'missedTaskChunks'
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
