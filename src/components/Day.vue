<template>
    <div
        class="
          column
          col-3
          col-md-6
          col-sm-12"
        v-bind:class="[
          { 'past-day': past },
          { 'current-day': today },
          { 'overloaded-day': overloaded }
        ]">
      <div class="header">
        {{ naturalDay }}
        <span class="float-right">
        <span class="
          fa fa-clock-o
          tooltip tooltip-left"
              data-tooltip="Max duration for day">
        </span>&nbsp;{{ maxDuration.toNumber() }}h
      </span>
      </div>
      <div class="body">
        <TaskChunk
          v-for="chunk in taskChunks"
          v-bind:key="chunk.id"
          v-bind:chunk="chunk"/>
      </div>
      <div class="footer">
        <span class="float-right">
          <span class="fa fa-clock-o tooltip"
                data-tooltip="Remaining/total scheduled duration">
          </span>&nbsp;{{ unfinishedScheduledDuration.toNumber() }}h/{{ scheduledDuration.toNumber() }}h
        </span>
      </div>
    </div>
</template>

<script>
import { isToday, isWeekend } from 'date-fns'

import { isPastDay, naturalDay } from '@/utils'
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
      // TODO: use today from store
      return naturalDay(this.day)
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
      // TODO: use today from store
      return isPastDay(this.day)
    },
    today () {
      // TODO: use today from store
      return isToday(this.day)
    }
  }
}
</script>
