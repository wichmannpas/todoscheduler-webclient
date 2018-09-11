<template>
  <div
      class="day"
      :class="[
        { 'past-day': past },
        { 'current-day': today },
        { 'overloaded-day': overloaded }
      ]">
    <div class="header">
      {{ naturalDay }}
      <span class="float-right">
        {{ maxDuration.toNumber() }}h
        <span
            class="tooltip tooltip-bottom"
              data-tooltip="Max duration for this day">
          <i class="material-icons normal-whitespace small">
            watch_later
          </i>
        </span>
    </span>
    </div>
    <div class="body">
      <TaskChunk
        v-for="chunk in taskChunks"
        v-bind:key="chunk.id"
        v-bind:chunk="chunk"
        @editTask="editTask" />
    </div>
    <div class="footer">
      <span class="float-right">
        {{ unfinishedScheduledDuration.toNumber() }}h/{{ scheduledDuration.toNumber() }}h
        <span
            class="tooltip"
            data-tooltip="Unfinished/total scheduled duration">
          <i class="material-icons normal-whitespace small">
            access_time
          </i>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import { isWeekend } from 'date-fns'

import { isBeforeDay, isToday, naturalDay } from '@/utils'
import TaskChunk from '@/components/TaskChunk'

export default {
  name: 'Day',
  components: {
    TaskChunk
  },
  props: [
    'day'
  ],
  computed: {
    naturalDay () {
      return naturalDay(this.day, this.$store.state.time.today)
    },

    taskChunks () {
      return this.$store.getters.taskChunksForDay(this.day)
    },

    scheduledDuration () {
      return this.$store.getters.scheduledDurationForDay(this.day)
    },
    unfinishedScheduledDuration () {
      return this.scheduledDuration.sub(
        this.$store.getters.finishedScheduledDurationForDay(this.day))
    },
    maxDuration () {
      if (isWeekend(this.day)) {
        return this.$store.state.user.user.workhoursWeekend
      }
      return this.$store.state.user.user.workhoursWeekday
    },
    overloaded () {
      return this.scheduledDuration.comparedTo(this.maxDuration) > 0
    },

    past () {
      return isBeforeDay(this.day, this.$store.state.time.today)
    },
    today () {
      return isToday(this.day, this.$store.state.time.today)
    }
  },
  methods: {
    editTask (task) {
      this.$emit('editTask', task)
    }
  }
}
</script>
