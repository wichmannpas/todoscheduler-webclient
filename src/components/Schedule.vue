<template>
  <div
      v-if="ready"
      class="schedule columns">
    <Day
      v-for="day in days"
      v-bind:key="day.getTime()"
      v-bind:day="day"
    />
  </div>
  <div
      v-else
      class="loading loading-lg">
  </div>
</template>

<script>
import { addDays, subDays } from 'date-fns'

import Day from '@/components/Day'

import '@/assets/scss/schedule.scss'

export default {
  name: 'Schedule',
  components: {
    Day
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
