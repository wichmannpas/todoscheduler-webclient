<template>
  <div
      v-if="ready"
      class="schedule mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <Day
        v-for="day in days"
        :key="day.getTime()"
        :day="day"
        @editTask="editTask"
        class="
          mdc-layout-grid__cell--span-3-desktop
          mdc-layout-grid__cell--span-4-tablet
          mdc-layout-grid__cell--span-12-phone" />
    </div>
    <EditTaskDialog
        @close="editDialogActive = false"
        v-if="editDialogActive"
        v-bind:task="editedTask"
    />
  </div>
  <Loading
      v-else />
</template>

<script>
import { addDays, subDays } from 'date-fns'

import Day from '@/components/Day'
import EditTaskDialog from '@/components/EditTaskDialog'
import Loading from '@/components/Loading'

import '@/assets/scss/schedule.scss'

export default {
  name: 'Schedule',
  components: {
    EditTaskDialog,
    Day,
    Loading
  },
  data: function () {
    return {
      editDialogActive: false,
      editedTask: null
    }
  },
  computed: {
    ready () {
      return this.$store.state.task.ready && this.$store.state.taskchunk.ready
    },
    days () {
      // TODO: use today from a store to make it reactive
      let today = new Date()
      let yesterday = subDays(today, 1)

      return this.getListOfDays(yesterday, 8)
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
    getListOfDays (firstDay, count) {
      let result = []

      let day = firstDay
      for (let i = 0; i < count; i++) {
        result.push(day)

        day = addDays(day, 1)
      }
      return result
    }
  }
}
</script>
