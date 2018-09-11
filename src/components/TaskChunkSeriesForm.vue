<template>
  <div>
    You can create a series that automatically schedules recurring task chunks for this task.

    <div
        ref="rule"
        class="mdc-select full-width-text-field">
      <select
          v-model="rule"
          class="mdc-select__native-control">
        <option></option>
        <option value="interval">Interval</option>
        <option value="monthly">Monthly, on a specific day</option>
        <option value="monthlyweekday">Monthly, on a specific weekday</option>
      </select>
      <label class="mdc-floating-label">
        Frequency
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('rule') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      Please make a choice.
    </p>

    <div
        :class="{ hidden: rule !== 'interval' }"
        class="mdc-text-field full-width-text-field">
      <input
          ref="intervalDaysInput"
          @keyup.enter="$emit('submit')"
          v-model="intervalDays"
          id="series-interval-days"
          type="number"
          min="1"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="series-interval-days">
        Every … day(s)
      </label>
    </div>
    <p
        v-if="errors.indexOf('interval_days') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This is not a valid choice.
    </p>

    <div
        :class="{ hidden: rule !== 'monthly' }"
        class="mdc-text-field full-width-text-field">
      <input
          ref="monthlyDayInput"
          @keyup.enter="$emit('submit')"
          v-model="monthlyDay"
          id="series-monthly-day"
          type="number"
          min="1"
          max="31"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="series-monthly-day">
        <span
            v-if="monthlyDay === '1'">
          On the …-st day of the month
        </span>
        <span
            v-else-if="monthlyDay === '2'">
          On the …-nd day of the month
        </span>
        <span
            v-else-if="monthlyDay === '3'">
          On the …-rd day of the month
        </span>
        <span
            v-else>
          On the …-th day of the month
        </span>
      </label>
    </div>
    <p
        v-if="errors.indexOf('monthly_day') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This is not a valid choice.
      Make sure that this is the same as the day of the start date, or a 31 if you want to use the last day of the month.
    </p>

    <div
        :class="{ hidden: rule !== 'monthlyweekday' }"
        class="mdc-text-field full-width-text-field">
      <input
          ref="monthlyweekdayNthInput"
          @keyup.enter="$emit('submit')"
          v-model="monthlyweekdayNth"
          id="series-monthlyweekday-nth"
          type="number"
          min="1"
          max="6"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="series-monthlyweekday-nth">
        <span
            v-if="monthlyweekdayNth === '1'">
          On the …-st
        </span>
        <span
            v-else-if="monthlyweekdayNth === '2'">
          On the …-nd
        </span>
        <span
            v-else-if="monthlyweekdayNth === '3'">
          On the …-rd
        </span>
        <span
            v-else>
          On the …-th
        </span>
      </label>
    </div>
    <p
        v-if="errors.indexOf('monthlyweekday_nth') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This is not a valid choice.
    </p>

    <div
        :class="{ hidden: rule !== 'monthlyweekday' }"
        class="mdc-select full-width-text-field">
      <select
          ref="monthlyweekdayWeekdayInput"
          id="series-monthlyweekday-weekday"
          v-model="monthlyweekdayWeekday"
          class="mdc-select__native-control">
        <option value="0">Monday</option>
        <option value="1">Tuesday</option>
        <option value="2">Wednesday</option>
        <option value="3">Thursday</option>
        <option value="4">Friday</option>
        <option value="5">Saturday</option>
        <option value="6">Sunday</option>
      </select>
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="series-monthlyweekday-weekday">
        … of the month
      </label>
    </div>
    <p
        v-if="errors.indexOf('monthlyweekday_weekday') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This is not a valid weekday.
    </p>

    <div
        :class="{ hidden: rule !== 'monthly' && rule !== 'monthlyweekday' }"
        class="mdc-text-field full-width-text-field">
      <input
          ref="monthlyMonthsInput"
          @keyup.enter="$emit('submit')"
          v-model="monthlyMonths"
          id="series-monthly-months"
          type="number"
          min="1"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="series-monthly-months">
        every … month(s)
      </label>
    </div>
    <p
        v-if="errors.indexOf('monthly_months') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This is not a valid choice.
    </p>

    <div
        class="mdc-text-field full-width-text-field">
      <input
          ref="startInput"
          @keyup.enter="$emit('submit')"
          v-model="start"
          id="series-start"
          type="date"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="series-start">
        starting on
      </label>
    </div>
    <p
        v-if="errors.indexOf('start') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This is not a valid start date.
      It must not be in the past.
      <span
          v-if="errors.indexOf('end') >= 0">
        Make sure that it is not after the end date.
      </span>
    </p>

    <div
        class="mdc-text-field full-width-text-field">
      <input
          ref="endInput"
          @keyup.enter="$emit('submit')"
          v-model="end"
          id="series-end"
          type="date"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="series-end">
        until
      </label>
    </div>
    <p
        v-if="errors.indexOf('end') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This is not a valid end date.
      <span
          v-if="errors.indexOf('start') >= 0">
        Make sure that it is not before the start date.
      </span>
    </p>
  </div>
</template>

<script>
import { lastDayOfMonth } from 'date-fns'
import { MDCSelect } from '@material/select'

import { formatDayString } from '@/utils'

export default {
  name: 'TaskChunkSeriesForm',
  props: {
    errors: Array
  },
  data: function () {
    return {
      ui: {
        ruleInput: null
      },
      rule: '',
      start: formatDayString(this.$store.state.time.today),
      end: '',
      intervalDays: '1',
      monthlyDay: this.$store.state.time.today.getDate(),
      monthlyMonths: '1',
      monthlyweekdayWeekday: '0',
      monthlyweekdayNth: '1'
    }
  },
  mounted: function () {
    if (this.ui.ruleInput === null) {
      this.ui.ruleInput = new MDCSelect(this.$refs.rule)
    }
  },
  watch: {
    rule () {
      this.emitInput()
    },
    start (value) {
      if (this.rule === 'monthly' && value !== '') {
        let start = new Date(value)
        let startDate = start.getDate()
        if (lastDayOfMonth(start).getDate() !== startDate || parseInt(this.monthlyDay) < 28) {
          // update monthly day if it is not the last day of the month
          this.monthlyDay = startDate
        }
      }
      this.emitInput()
    },
    end () {
      this.emitInput()
    },
    intervalDays () {
      this.emitInput()
    },
    monthlyDay (value) {
      if (this.rule === 'monthly' && value !== '') {
        let start = new Date(this.start)
        let month = start.getMonth()
        start.setDate(value)
        if (start.getMonth() !== month) {
          start = lastDayOfMonth(new Date(this.start))
        }
        this.start = formatDayString(start)
      }
      this.emitInput()
    },
    monthlyMonths () {
      this.emitInput()
    },
    monthlyweekdayWeekday () {
      this.emitInput()
    },
    monthlyweekdayNth () {
      this.emitInput()
    }
  },
  methods: {
    emitInput () {
      let data = {
        rule: this.rule,
        start: this.start,
        end: this.end
      }
      if (this.rule === 'interval') {
        data.intervalDays = this.intervalDays
      }
      if (this.rule === 'monthly') {
        data.monthlyDay = this.monthlyDay
      }
      if (this.rule === 'monthly' || this.rule === 'monthlyweekday') {
        data.monthlyMonths = this.monthlyMonths
      }
      if (this.rule === 'monthlyweekday') {
        data.monthlyweekdayWeekday = this.monthlyweekdayWeekday
        data.monthlyweekdayNth = this.monthlyweekdayNth
      }
      this.$emit('input', data)
    }
  }
}
</script>
