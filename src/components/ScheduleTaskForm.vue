<template>
  <form
      style="position: relative"
      @submit.prevent="scheduleTask">

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

    <div
        v-if="longDuration"
        class="warning">
      You are about to schedule a very long duration to a single day!
    </div>

    <Loading v-if="loading" />
  </form>
</template>

<script>
import { MDCSelect } from '@material/select'
import { MDCTextField } from '@material/textfield'
import Vue from 'vue'

import { scheduleTask } from '@/api/task'
import Loading from '@/components/Loading'
import { formatDayString } from '@/utils'

export default {
  name: 'ScheduleTaskForm',
  components: {
    Loading
  },
  props: [
    'task'
  ],
  data: function () {
    return {
      ui: {
        scheduleForInput: null,
        durationInput: null
      },
      loading: false,
      scheduleFor: 'today',
      scheduleForDate: formatDayString(new Date()),
      duration: this.task.defaultScheduleDuration(
        this.$store.state.user.user).toNumber(),
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

    this.$refs.durationInput.focus()
  },
  computed: {
    longDuration () {
      return this.duration > this.$store.state.user.user.workhoursWeekday.toNumber()
    }
  },
  methods: {
    scheduleTask () {
      if (this.loading) {
        return
      }

      this.loading = true

      let day = this.scheduleForDate
      if (this.scheduleFor !== 'another_time') {
        day = this.scheduleFor
      }
      scheduleTask(this.$store, this.task, day, this.duration).then((response) => {
        this.loading = false
        Vue.set(this, 'errors', [])

        this.$emit('complete')
      }).catch((response) => {
        this.loading = false

        Vue.set(this, 'errors', Object.keys(response))
      })
    }
  }
}
</script>
