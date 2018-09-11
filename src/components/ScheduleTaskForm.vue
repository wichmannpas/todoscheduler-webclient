<template>
  <form
      style="position: relative"
      @submit.prevent="scheduleTask">

    <div
        :class="{ hidden: series }">
      <!-- TODO: Move scheduleFor (including another time date input) into a dedicated component and reuse it //-->
      <div
          ref="scheduleFor"
          class="mdc-select full-width-text-field">
        <select
            v-model="scheduleFor"
            class="mdc-select__native-control">
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="next_free_capacity">Next Free Capacity</option>
          <option value="another_time">Another Time</option>
        </select>
        <label class="mdc-floating-label mdc-floating-label--float-above">
          Schedule for
        </label>
        <div class="mdc-line-ripple"></div>
      </div>

      <div
          :class="{ hidden: scheduleFor !== 'another_time' }"
          class="mdc-text-field full-width-text-field">
        <input
            @keyup.enter="scheduleTask"
            v-model="scheduleForDate"
            id="task-start"
            type="date"
            class="mdc-text-field__input" />
        <label
            class="mdc-floating-label mdc-floating-label--float-above"
            for="task-start">
          Schedule for date
        </label>
      </div>
      <p
          v-if="errors.indexOf('day') >= 0"
          class="
            mdc-text-field-helper-text
            mdc-text-field-helper-text--validation-msg
            mdc-text-field-helper-text--persistent
            error">
        This date is invalid.
      </p>
    </div>

    <div
        ref="duration"
        class="
          mdc-text-field
          full-width-text-field
          mdc-text-field--with-trailing-icon">
      <input
          id="task-duration"
          ref="durationInput"
          v-model="duration"
          :disabled="loading"
          type="number"
          step="0.01"
          class="
            mdc-text-field__input
            align-right" />
      <label
          class="mdc-floating-label"
          for="task-duration">
        Duration
      </label>
      <span
          class="mdc-text-field__icon mdc-text-field__text"
          tabindex="-1">h</span>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('duration') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This duration is invalid.
    </p>

    <textarea
        v-model="notes"
        @keyup.enter="handleNotesKeyup"
        class="full-width-text-field"
        :disabled="loading"
        :class="{ hidden: series }"
        rows="5" />
    <p
        v-if="errors.indexOf('notes') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      These notes are invalid.
    </p>

    <div
        v-if="missesDeadline"
        class="error">
      This task chunk will miss the tasks deadline.
    </div>

    <div
        v-if="longDuration"
        class="warning">
      You are about to schedule a very long duration to a single day!
    </div>

    <div
        ref="series"
        class="mdc-switch">
      <div class="mdc-switch__track"></div>
      <div class="mdc-switch__thumb-underlay">
        <div class="mdc-switch__thumb">
            <input
                v-model="series"
                :disabled="loading"
                type="checkbox"
                id="schedule-series"
                class="mdc-switch__native-control"
                role="switch">
        </div>
      </div>
    </div>
    <label for="schedule-series">Create a Series</label>
    <TaskChunkSeriesForm
        v-if="series"
        :errors="errors"
        @submit="scheduleTask"
        @input="seriesData = $event" />

    <Loading v-if="loading" />
  </form>
</template>

<script>
import { addDays } from 'date-fns'
import { MDCSelect } from '@material/select'
import { MDCSwitch } from '@material/switch'
import { MDCTextField } from '@material/textfield'
import Vue from 'vue'

import { scheduleTask } from '@/api/task'
import { createTaskChunkSeries } from '@/api/taskchunk'
import TaskChunkSeriesForm from '@/components/TaskChunkSeriesForm'
import Loading from '@/components/Loading'
import { isAfterDay, formatDayString } from '@/utils'

export default {
  name: 'ScheduleTaskForm',
  components: {
    Loading,
    TaskChunkSeriesForm
  },
  props: [
    'task'
  ],
  data: function () {
    return {
      ui: {
        scheduleForInput: null,
        durationInput: null,
        seriesSwitch: null
      },
      loading: false,
      series: false,
      seriesData: {},
      scheduleFor: 'today',
      scheduleForDate: formatDayString(new Date()),
      duration: this.task.defaultScheduleDuration(
        this.$store.state.user.user).toNumber(),
      notes: '',
      errors: []
    }
  },
  created: function () {
    this.$parent.$on('schedule', this.scheduleTask)
  },
  mounted: function () {
    if (this.ui.scheduleForInput === null) {
      this.ui.scheduleForInput = new MDCSelect(this.$refs.scheduleFor)
    }
    if (this.ui.durationInput === null) {
      this.ui.durationInput = new MDCTextField(this.$refs.duration)
    }

    if (this.ui.seriesSwitch === null) {
      this.ui.seriesSwitch = new MDCSwitch(this.$refs.series)
    }

    this.$refs.durationInput.focus()
  },
  computed: {
    longDuration () {
      return this.duration > this.$store.state.user.user.workhoursWeekday.toNumber()
    },
    missesDeadline () {
      if (this.task.deadline === null) {
        // task has no deadline that can be missed
        return false
      }

      let scheduleForDate
      if (this.scheduleFor === 'today') {
        scheduleForDate = this.$store.state.time.today
      } else if (this.scheduleFor === 'tomorrow') {
        scheduleForDate = addDays(this.$store.state.time.today, 1)
      } else {
        scheduleForDate = new Date(this.scheduleForDate)
      }

      return isAfterDay(scheduleForDate, this.task.deadline)
    }
  },
  methods: {
    scheduleTask () {
      if (this.loading) {
        return
      }

      this.loading = true

      if (this.series) {
        this.scheduleSeries()
      } else {
        this.scheduleSingle()
      }
    },
    scheduleSingle () {
      let day = this.scheduleForDate
      if (this.scheduleFor !== 'another_time') {
        day = this.scheduleFor
      }
      scheduleTask(this.$store, this.task, day, this.duration, this.notes).then(response => {
        Vue.set(this, 'errors', [])

        this.$emit('complete')
      }).catch((response) => {
        Vue.set(this, 'errors', Object.keys(response))
      }).finally(() => {
        this.loading = false
      })
    },
    scheduleSeries () {
      let end = this.seriesData.end
      if (end === '') {
        end = null
      }

      createTaskChunkSeries(this.$store, this.task, {
        duration: this.duration,
        start: this.seriesData.start,
        end: end,
        rule: this.seriesData.rule,
        intervalDays: this.seriesData.intervalDays,
        monthlyDay: this.seriesData.monthlyDay,
        monthlyMonths: this.seriesData.monthlyMonths,
        monthlyweekdayWeekday: this.seriesData.monthlyweekdayWeekday,
        monthlyweekdayNth: this.seriesData.monthlyweekdayNth
      }).then(response => {
        Vue.set(this, 'errors', [])

        this.$emit('complete')
      }).catch((response) => {
        Vue.set(this, 'errors', Object.keys(response))
      }).finally(() => {
        this.loading = false
      })
    },
    handleNotesKeyup (event) {
      if (event.ctrlKey || event.MetaKey) {
        this.scheduleTask()
      }
    }
  }
}
</script>
