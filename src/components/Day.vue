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
    <div
        ref="dragContainer"
        class="body">
      <TaskChunk
        v-for="chunk in taskChunks"
        v-bind:key="chunk.id"
        v-bind:chunk="chunk"
        @editTaskChunkSeries="editTaskChunkSeries"
        @editTaskChunkNotes="editTaskChunkNotes"
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
import Sortable from 'sortablejs'

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
  mounted: function () {
    Sortable.create(this.$refs.dragContainer, {
      handle: '.drag-handle',
      group: 'day-taskchunks',
      animation: 0,
      filter (event, elem) {
        // TODO: finished
        return false
      },
      onMove (event, originalEvent) {
        let relatedFinished = event.related.classList.contains('finished')

        let relatedEnd = event.relatedRect.top + event.relatedRect.height

        if (relatedFinished && originalEvent.clientY < relatedEnd) {
          // do not allow moving above finished element
          return false
        }
      },
      /**
       * revert the drag move to re-do it later using the store as soon
       * as the server has acknowledged the request.
       */
      onEnd (event) {
        let item = event.item

        if (event.from !== event.to) {
          // changed day

          if (event.oldIndex >= event.from.childNodes.length) {
            // was last of day
            event.from.appendChild(item)
          } else {
            event.from.insertBefore(item, event.from.childNodes[event.oldIndex])
          }
        } else {
          // moved within the same day

          if (event.oldIndex < event.newIndex) {
            // moved down
            event.from.insertBefore(item, event.from.childNodes[event.oldIndex])
          } else if (event.oldIndex > event.newIndex) {
            // moved up
            event.from.insertBefore(item, event.from.childNodes[event.oldIndex].nextSibling)
          }
        }

        return false
      }
    })
  },
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
    },
    editTaskChunkSeries (series) {
      this.$emit('editTaskChunkSeries', series)
    },
    editTaskChunkNotes (chunk) {
      this.$emit('editTaskChunkNotes', chunk)
    }
  }
}
</script>
