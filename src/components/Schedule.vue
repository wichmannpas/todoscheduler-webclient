<template>
  <div v-if="ready">
    <ScheduleNavigation
        @navigate="navigate"
        :firstDay="firstDay" />
    <div
        class="schedule mdc-layout-grid">
      <div class="mdc-layout-grid__inner">

        <Day
          v-for="day in days"
          :key="day.getTime()"
          :day="day"
          @editTask="editTask"
          @editTaskChunkSeries="editTaskChunkSeries"
          @editTaskChunkNotes="editTaskChunkNotes"
          class="
            mdc-layout-grid__cell--span-3-desktop
            mdc-layout-grid__cell--span-4-tablet
            mdc-layout-grid__cell--span-12-phone" />
      </div>
      <EditTaskDialog
          @close="editDialogActive = false"
          v-if="editDialogActive"
          :task="editedTask" />
      <EditTaskChunkSeriesDialog
          @close="editSeriesDialogActive = false"
          v-if="editSeriesDialogActive"
          :series="editedSeries" />
      <EditTaskChunkNotesDialog
          @close="editNotesDialogActive = false"
          v-if="editNotesDialogActive"
          :chunk="editedChunk" />
    </div>
  </div>
  <Loading
      v-else />
</template>

<script>
import { addDays, subDays } from 'date-fns'

import Day from '@/components/Day'
import EditTaskChunkNotesDialog from '@/components/EditTaskChunkNotesDialog'
import EditTaskChunkSeriesDialog from '@/components/EditTaskChunkSeriesDialog'
import EditTaskDialog from '@/components/EditTaskDialog'
import Loading from '@/components/Loading'
import ScheduleNavigation from '@/components/ScheduleNavigation'

import '@/assets/scss/schedule.scss'

export default {
  name: 'Schedule',
  components: {
    Day,
    EditTaskChunkNotesDialog,
    EditTaskChunkSeriesDialog,
    EditTaskDialog,
    Loading,
    ScheduleNavigation
  },
  data: function () {
    return {
      editDialogActive: false,
      editNotesDialogActive: false,
      editedTask: null,
      editSeriesDialogActive: false,
      editedChunk: null,
      editedSeries: null
    }
  },
  computed: {
    ready () {
      return this.$store.state.task.ready && this.$store.state.taskchunk.ready
    },
    days () {
      return this.getListOfDays(this.firstDay, 8)
    },
    firstDay () {
      let day = this.$store.state.taskchunk.firstDisplayedDay
      if (day === null) {
        return this.yesterday
      }
      return day
    },
    yesterday () {
      return subDays(this.$store.state.time.today, 1)
    }
  },
  methods: {
    editTask (task) {
      if (this.editDialogActive === true) {
        console.warn('not opening edit dialog as it is already active')
        return
      }
      this.editDialogActive = true
      this.editedTask = task
    },
    editTaskChunkSeries (series) {
      if (this.editSeriesDialogActive === true) {
        console.warn('not opening edit series dialog as it is already active')
        return
      }
      this.editSeriesDialogActive = true
      this.editedSeries = series
    },
    editTaskChunkNotes (chunk) {
      if (this.editNotesDialogActive === true) {
        console.warn('not opening edit notes dialog as it is already active')
        return
      }
      this.editNotesDialogActive = true
      this.editedChunk = chunk
    },
    getListOfDays (firstDay, count) {
      let result = []

      let day = firstDay
      for (let i = 0; i < count; i++) {
        result.push(day)

        day = addDays(day, 1)
      }
      return result
    },
    navigate (firstDay) {
      this.$store.dispatch('navigateToDay', firstDay)
    }
  }
}
</script>
