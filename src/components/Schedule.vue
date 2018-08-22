<template>
  <div class="schedule columns">
    <Day
      v-for="day in days()"
      v-bind:key="day.dayString"
      v-bind:day="day"
    />
  </div>
</template>

<script>
import { addDays, subDays } from 'date-fns'

import { fetchTaskChunks } from '@/api/taskChunk'
import Day from '@/components/Day'

export default {
  name: 'Schedule',
  components: {
    Day
  },
  created: function () {
    fetchTaskChunks(this.$store)
  },
  methods: {
    days () {
      let today = new Date()
      let yesterday = subDays(today, 1)
      return this.getListOfDays(yesterday, 8)
    },
    getListOfDays (firstDay, count) {
      let result = []
      let day = firstDay
      for (let i = 0; i < count; i++) {
        result.push(this.$store.getters.taskChunksForDay(day))

        day = addDays(day, 1)
      }
      return result
      /*
      return [
        {
          day: 'yesterday',
          past: true,
          today: false,
          overloaded: false,
          chunks: [
            {
              id: 42,
              task: {
                id: 42,
                duration: 5,
                name: 'Testtask'
              },
              duration: 2,
              finished: true,
              overdue: false
            },
            {
              id: 42,
              task: {
                id: 42,
                duration: 0.5,
                name: 'Testtask'
              },
              duration: 0.5,
              finished: false,
              overdue: false
            }
          ]
        },
        {
          day: 'today',
          past: false,
          today: true,
          overloaded: false
        },
        {
          day: 'tomorrow',
          past: false,
          today: false,
          overloaded: true
        },
        {
          day: 'todo',
          past: false,
          today: false,
          overloaded: false
        },
        {
          day: 'todo',
          past: false,
          today: false,
          overloaded: false
        },
        {
          day: 'todo',
          past: false,
          today: false,
          overloaded: false
        },
        {
          day: 'todo',
          past: false,
          today: false,
          overloaded: false
        },
        {
          day: 'todo',
          past: false,
          today: false,
          overloaded: false
        }
      ] */
    }
  }
}
</script>
