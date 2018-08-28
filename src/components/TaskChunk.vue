<template>
  <span
      v-bind:class="[
        'task-chunk',
        { finished: chunk.finished },
        { overdue: chunk.overdue }
      ]"
      v-bind:style="[
        { height: (chunk.duration.toNumber() * 4).toString() + 'em' }
      ]">
    <span
        class="tooltip tooltip-right warning"
        data-tooltip="This task chunk misses the deadline"
        v-if="chunk.missesDeadline($store)">
      <i class="material-icons">
        warning
      </i>
    </span>
    <strong>{{ chunk.task($store).name }}</strong>
    <span class="float-right">
      {{ chunk.duration.toNumber() }}h
      <span v-if="chunk.task($store).duration.toNumber() !== chunk.duration.toNumber()">
        ({{ chunk.task($store).duration.toNumber() }}h)
      </span>
    </span>
    <br/>
    <span class="float-left">
      <a
          @click="finishChunk(true)"
          v-if="!chunk.finished"
          class="tooltip tooltip-right"
          data-tooltip="Done">
        <font-awesome-icon
            icon="check" />
      </a>
      <a
          @click="finishChunk(false)"
          v-if="chunk.finished"
          class="tooltip tooltip-right"
          data-tooltip="Not done">
        <font-awesome-icon
            icon="undo" />
      </a>
      <a
          @click="deleteChunk()"
          class="tooltip tooltip-right"
          data-tooltip="No time needed on this day">
        <font-awesome-icon
            icon="times" />
      </a>
      <a
          @click="postponeChunk()"
          class="tooltip tooltip-right"
          data-tooltip="Postpone to another day">
        <font-awesome-icon
            :icon="['far', 'clock']" />
      </a>
      <a
          @click="increaseTaskDuration(1)"
          class="tooltip tooltip-right"
          data-tooltip="Needs more time on another day">
        <font-awesome-icon
            :icon="['far', 'copy']" />
      </a>
      <a
          @click="$emit('editTask', chunk.task($store))"
          class="
            task-edit
            tooltip tooltip-right"
          data-tooltip="Edit task">
        <font-awesome-icon
            icon="pencil-alt" />
      </a>
    </span>
    <span class="float-right">
      <a
          @click="splitChunk()"
          class="tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': !canBeSplit }
          ]"
          data-tooltip="Split task chunk">
        <font-awesome-icon
            icon="layer-group" />
      </a>
      <a
          @click="updateChunkDay(-1)"
          class="tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished }
          ]"
          data-tooltip="Move to previous day">
        <font-awesome-icon
            icon="arrow-left" />
      </a>
      <a
          @click="moveChunk(-1)"
          class="tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished },
            { 'invisible': !canBeMovedUp }
          ]"
         data-tooltip="Needs time earlier">
        <font-awesome-icon
            icon="arrow-up" />
      </a>
      <a
          @click="moveChunk(1)"
          class="tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished },
            { 'invisible': !canBeMovedDown }
          ]"
          data-tooltip="Needs time later">
        <font-awesome-icon
            icon="arrow-down" />
      </a>
      <a
          @click="updateChunkDay(1)"
          class="tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished }
          ]"
          data-tooltip="Move to next day">
        <font-awesome-icon
            icon="arrow-right" />
      </a>
      <a
          @click="changeChunkDuration('-0.5')"
          class="tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.duration.toNumber() <= 0.5 }
          ]"
          data-tooltip="Takes 30 less minutes">
        <font-awesome-icon
            icon="minus" />
      </a>
      <a
          @click="changeChunkDuration('0.5')"
          class="tooltip tooltip-left"
          data-tooltip="Takes 30 more minutes">
        <font-awesome-icon
            icon="plus" />
      </a>
    </span>
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
