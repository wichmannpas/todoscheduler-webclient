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
            class="tooltip tooltip-left"
              data-tooltip="Max duration for this day">
          <i class="material-icons normal-whitespace small">
            watch_later
          </i>
        </span>
      </span>
    </div>
    <div
        ref="dragContainer"
        :data-day="formattedDay"
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
      <span>
        <span
          class="tooltip tooltip-right"
          data-tooltip="Unfinished/total scheduled task chunk count">
          <i class="material-icons normal-whitespace small">
            check_circle
          </i>
          {{ unfinishedTaskChunkCount }}/{{ taskChunkCount }}
        </span>
      </span>
      <span class="float-right">
        {{ unfinishedScheduledDuration.toNumber() }}h/{{ scheduledDuration.toNumber() }}h
        <span
            class="tooltip tooltip-left"
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

import { formatDayString, isBeforeDay, isToday, naturalDay } from '@/utils'
import TaskChunk from '@/components/TaskChunk'
import { moveTaskChunk } from '@/api/taskchunk'

export default {
  name: 'Day',
  components: {
    TaskChunk
  },
  props: [
    'day'
  ],
  mounted () {
    let store = this.$store

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
       *
       * It may be required to find a better solution in order to prevent
       * race conditions with DOM updates of Vue (e.g., simultaneously
       * arriving updates)
       */
      onEnd (event) {
        let item = event.item

        if (event.from === event.to && event.oldIndex === event.newIndex) {
          // not actually moved
          return
        }

        // determine new day and day order
        let day = event.to.dataset['day']
        let dayOrder
        if (item.nextSibling === null) {
          // last item of list, determine new day order
          if (event.to.children.length === 1) {
            // new item is the only children, assign new day order
            dayOrder = 1
          } else {
            // increment day order of second-last item
            dayOrder = parseInt(event.to.children[event.to.children.length - 2].dataset.dayOrder) + 1
          }
        } else {
          // place before specified element by using its day order
          dayOrder = parseInt(item.nextSibling.dataset.dayOrder)
        }

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

        let chunkId = parseInt(item.dataset.chunkId)
        moveTaskChunk(store, chunkId, day, dayOrder)
      }
    })
  },
  computed: {
    naturalDay () {
      return naturalDay(this.day, this.$store.state.time.today)
    },
    formattedDay () {
      return formatDayString(this.day)
    },

    taskChunks () {
      return this.$store.getters.taskChunksForDay(this.day)
    },
    taskChunkCount () {
      return this.taskChunks.length
    },
    unfinishedTaskChunkCount () {
      return this.taskChunks.filter(chunk => !chunk.finished).length
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
