<template>
  <span
      v-bind:class="[
        'task-chunk',
        { highlighted: chunk.highlighted($store) },
        { finished: chunk.finished },
        { overdue: chunk.overdue }
      ]"
      v-bind:style="[
        { height: (chunk.duration.toNumber() * 4).toString() + 'em' }
      ]">
    <span
        class="chunk-title">
      <span
          class="tooltip tooltip-right warning"
          data-tooltip="Misses deadline"
          v-if="chunk.missesDeadline($store)">
        <i class="material-icons">
          warning
        </i>
      </span>
      {{ task.name }}
    </span>
    <span class="float-right">
      {{ chunk.duration.toNumber() }}h
      <span v-if="task.duration.toNumber() !== chunk.duration.toNumber()">
        ({{ task.duration.toNumber() }}h)
      </span>
    </span>
    <br/>
    <span class="float-left">
      <a
          v-if="!chunk.finished"
          @click="finishChunk(true)"
          class="action tooltip tooltip-right"
          data-tooltip="Done">
        <i class="material-icons">
          check
        </i>
      </a>
      <a
          v-else
          @click="finishChunk(false)"
          class="action tooltip tooltip-right"
          data-tooltip="Not done">
        <i class="material-icons">
          undo
        </i>
      </a>

      <a
          @click="deleteChunk()"
          class="action tooltip tooltip-right"
          data-tooltip="No time needed on this day">
        <i class="material-icons">
          clear
        </i>
      </a>
      <a
          @click="postponeChunk()"
          class="action tooltip tooltip-right"
          data-tooltip="Postpone to another day">
        <i class="material-icons">
          watch_later
        </i>
      </a>
      <a
          @click="increaseTaskDuration(1)"
          class="action tooltip tooltip-right"
          data-tooltip="Needs more time on another day">
        <i class="material-icons">
          content_copy
        </i>
      </a>
      <a
          @click="$emit('editTask', task)"
          class="
            action
            task-edit
            tooltip tooltip-right"
          data-tooltip="Edit task">
        <i class="material-icons">
          edit
        </i>
      </a>
      <a
          @click="$emit('editTaskChunkNotes', chunk)"
          class="
            action
            task-edit
            tooltip tooltip-right"
          :class="{
            'has-chunk-notes': task.hasNotes(),
            'has-task-notes': chunk.hasNotes()
          }"
          data-tooltip="Edit notes">
        <i class="material-icons">
          speaker_notes
        </i>
      </a>
      <a
          v-if="series !== null"
          @click="$emit('editTaskChunkSeries', series)"
          class="
            action
            task-edit
            tooltip tooltip-right"
          :data-tooltip="series.description()">
        <i class="material-icons">
          av_timer
        </i>
      </a>
    </span>
    <span class="float-right">
      <a
          @click="splitChunk()"
          class="action tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': !canBeSplit }
          ]"
          data-tooltip="Split task chunk">
        <i class="material-icons">
          layers
        </i>
      </a>
      <span
          v-if="enableDragAndDrop"
          class="c-hand drag-handle action tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished }
          ]"
          data-tooltip="Move">
        <i class="material-icons">
          drag_handle
        </i>
      </span>
      <a
          v-if="!enableDragAndDrop"
          @click="updateChunkDay(-1)"
          class="action tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished }
          ]"
          data-tooltip="Move to previous day">
        <i class="material-icons">
          arrow_back
        </i>
      </a>
      <a
          v-if="!enableDragAndDrop"
          @click="moveChunk(-1)"
          class="action tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished },
            { 'invisible': !canBeMovedUp }
          ]"
         data-tooltip="Needs time earlier">
        <i class="material-icons">
          arrow_upward
        </i>
      </a>
      <a
          v-if="!enableDragAndDrop"
          @click="moveChunk(1)"
          class="action tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished },
            { 'invisible': !canBeMovedDown }
          ]"
          data-tooltip="Needs time later">
        <i class="material-icons">
          arrow_downward
        </i>
      </a>
      <a
          v-if="!enableDragAndDrop"
          @click="updateChunkDay(1)"
          class="action tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished }
          ]"
          data-tooltip="Move to next day">
        <i class="material-icons">
          arrow_forward
        </i>
      </a>
      <a
          @click="changeChunkDuration('-0.5')"
          class="action tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.duration.toNumber() <= 0.5 }
          ]"
          data-tooltip="Takes 30 less minutes">
        <i class="material-icons">
          remove
        </i>
      </a>
      <a
          @click="changeChunkDuration('0.5')"
          class="action tooltip tooltip-left"
          data-tooltip="Takes 30 more minutes">
        <i class="material-icons">
          add
        </i>
      </a>
    </span>
    <div class="labels">
      <span
          v-for="label in task.labels($store)"
          :key="label.id"
          class="label"
          :style="{
            background: '#' + label.color,
            color: '#' + label.invertedColor()
          }">
        {{ label.title }}
      </span>
    </div>
    <Loading
        v-if="loading" />
  </span>
</template>

<script>
import { changeTaskDuration } from '@/api/task'
import {
  changeTaskChunkDuration,
  deleteTaskChunk,
  exchangeTaskChunk,
  finishTaskChunk,
  splitTaskChunk,
  updateTaskChunkDay
} from '@/api/taskchunk'
import Loading from '@/components/Loading'
import { dayDelta } from '@/utils'

import '@/assets/scss/taskchunk.scss'

export default {
  name: 'TaskChunk',
  components: {
    Loading
  },
  props: [
    'chunk'
  ],
  data: function () {
    return {
      loading: false
    }
  },
  computed: {
    canBeMovedUp () {
      return this.$store.getters.taskChunkToExchange(
        this.chunk, -1) !== null
    },
    canBeMovedDown () {
      return this.$store.getters.taskChunkToExchange(
        this.chunk, 1) !== null
    },
    canBeSplit () {
      return !this.chunk.finished && this.chunk.duration.comparedTo(1) > 0
    },
    task () {
      return this.chunk.task(this.$store)
    },
    series () {
      return this.chunk.series(this.$store)
    },
    enableDragAndDrop () {
      return window.innerWidth >= 300 && window.innerHeight >= 500
    }
  },
  methods: {
    changeChunkDuration (delta) {
      this.loading = true
      changeTaskChunkDuration(
        this.$store,
        this.chunk,
        this.chunk.duration.add(delta).toString()).finally(
        () => {
          this.loading = false
        })
    },
    deleteChunk () {
      if (!confirm('Are you sure that you want to delete this task chunk?')) {
        return
      }

      this.loading = true
      deleteTaskChunk(
        this.$store,
        this.chunk,
        false
      ).finally(
        () => {
          this.loading = false
        })
    },
    finishChunk (newState) {
      this.loading = true
      finishTaskChunk(
        this.$store,
        this.chunk,
        newState
      ).finally(() => {
        this.loading = false
      })
    },
    increaseTaskDuration (delta) {
      let task = this.chunk.task(this.$store)
      this.loading = true
      changeTaskDuration(
        this.$store,
        task,
        task.duration.add(delta.toString())
      ).finally(() => {
        this.loading = false
      })
    },
    moveChunk (direction) {
      let exchange = this.$store.getters.taskChunkToExchange(
        this.chunk,
        direction)
      if (exchange === null) {
        // nothing to exchange with
        return
      }

      this.loading = true
      exchangeTaskChunk(
        this.$store,
        this.chunk,
        exchange
      ).finally(() => {
        this.loading = false
      })
    },
    postponeChunk () {
      this.loading = true
      deleteTaskChunk(
        this.$store,
        this.chunk,
        true
      ).finally(() => {
        this.loading = false
      })
    },
    splitChunk () {
      this.loading = true
      splitTaskChunk(
        this.$store,
        this.chunk
      ).finally(
        () => {
          this.loading = false
        })
    },
    updateChunkDay (direction) {
      let newDay = dayDelta(
        this.chunk.day,
        direction * 86400000)

      this.loading = true
      updateTaskChunkDay(
        this.$store,
        this.chunk,
        newDay).finally(
        () => {
          this.loading = false
        })
    }
  }
}
</script>
