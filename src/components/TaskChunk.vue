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
    <strong>{{ chunk.task.name }}</strong>
    {{ chunk.dayOrder }}
    <span
      v-if="loading"
      class="loading loading-lg"></span>
    <span class="float-right">
      {{ chunk.duration.toNumber() }}h
      <span v-if="chunk.task.duration.toNumber() !== chunk.duration.toNumber()">
        ({{ chunk.task.duration.toNumber() }}h)
      </span>
    </span>
    <br/>
    <span class="float-left">
      <a
          @click="finishChunk(true)"
          v-if="!chunk.finished"
          class="tooltip tooltip-right"
          data-tooltip="Done">
        <span class="fa fa-check"></span>
      </a>
      <a
          @click="finishChunk(false)"
          v-if="chunk.finished"
          class="tooltip tooltip-right"
          data-tooltip="Not done">
        <span class="fa fa-undo"></span>
      </a>
      <a
          @click="deleteChunk()"
          class="tooltip tooltip-right"
          data-tooltip="No time needed on this day">
        <span class="fa fa-times"></span>
      </a>
      <a
          @click="postponeChunk()"
          class="tooltip tooltip-right"
          data-tooltip="Postpone to another day">
        <span class="fa fa-clock-o"></span>
      </a>
      <a
          @click="increaseTaskDuration(1)"
          class="tooltip tooltip-right"
          data-tooltip="Needs more time on another day">
        <span class="fa fa-files-o"></span>
      </a>
      <a
          @click="editModalActive = true"
          class="
            task-edit
            tooltip tooltip-right"
          data-tooltip="Edit task">
        <span class="fa fa-pencil"></span></a>
    </span>
    <span class="float-right">
      <a
          @click="updateChunkDay(-1)"
          class="tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished }
          ]"
          data-tooltip="Move to previous day">
        <span class="fa fa-arrow-left"></span>
      </a>
      <a
          @click="moveChunk(-1)"
          class="tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished },
            { 'invisible': !canBeMovedUp }
          ]"
         data-tooltip="Needs time earlier">
        <span class="fa fa-arrow-up"></span>
      </a>
      <a
          @click="moveChunk(1)"
          class="tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished },
            { 'invisible': !canBeMovedDown }
          ]"
          data-tooltip="Needs time later">
        <span class="fa fa-arrow-down"></span>
      </a>
      <a
          @click="updateChunkDay(1)"
          class="tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.finished }
          ]"
          data-tooltip="Move to next day">
        <span class="fa fa-arrow-right"></span>
      </a>
      <a
          @click="changeChunkDuration('-0.5')"
          class="tooltip tooltip-left"
          v-bind:class="[
            { 'invisible': chunk.duration.toNumber() <= 0.5 }
          ]"
          data-tooltip="Takes 30 less minutes">
        <span class="fa fa-minus"></span>
      </a>
      <a
          @click="changeChunkDuration('0.5')"
          class="tooltip tooltip-left"
          data-tooltip="Takes 30 more minutes">
        <span class="fa fa-plus"></span>
      </a>
    </span>
    <EditTaskModal
        @close="editModalActive = false"
        v-if="editModalActive"
        v-bind:task="chunk.task"
    />
  </span>
</template>

<script>
import { changeTaskDuration } from '@/api/task'
import {
  changeTaskChunkDuration,
  deleteTaskChunk,
  exchangeTaskChunk,
  finishTaskChunk,
  updateTaskChunkDay
} from '@/api/taskchunk'
import EditTaskModal from '@/components/EditTaskModal'
import { dayDelta } from '@/utils'

import '@/assets/scss/taskchunk.scss'

export default {
  name: 'TaskChunk',
  components: {
    EditTaskModal
  },
  props: [
    'chunk'
  ],
  data: function () {
    return {
      loading: false,
      editModalActive: false
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
    }
  },
  methods: {
    changeChunkDuration (delta) {
      this.loading = true
      changeTaskChunkDuration(
        this.$store,
        this.chunk,
        this.chunk.duration.add(delta).toString()).then(
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
        false).then(
        () => {
          this.loading = false
        })
    },
    finishChunk (newState) {
      this.loading = true
      finishTaskChunk(
        this.$store,
        this.chunk,
        newState).then(
        () => {
          this.loading = false
        })
    },
    increaseTaskDuration (delta) {
      this.loading = true
      changeTaskDuration(
        this.$store,
        this.chunk.task,
        this.chunk.task.duration.add(delta.toString())).then(
        () => {
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
        exchange).then(
        () => {
          this.loading = false
        })
    },
    postponeChunk () {
      this.loading = true
      deleteTaskChunk(
        this.$store,
        this.chunk,
        true).then(
        () => {
          this.loading = false
        })
    },
    updateChunkDay (direction) {
      let newDay = dayDelta(
        this.chunk.day,
        direction * 86400000)
      console.log(this.chunk.day)

      this.loading = true
      updateTaskChunkDay(
        this.$store,
        this.chunk,
        newDay).then(
        () => {
          this.loading = false
        })
    }
  }
}
</script>
