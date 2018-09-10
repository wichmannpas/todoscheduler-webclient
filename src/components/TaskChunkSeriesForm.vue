<template>
  <form
      @submit.prevent="$emit('submit')">
    You can create a series that automatically schedules recurring task chunks for this task.

    <div
        ref="rule"
        class="mdc-select full-width-text-field">
      <select
          v-model="rule"
          @input="emitInput"
          @change="emitInput"
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

    <div
        v-if="rule === 'interval'"
        class="mdc-text-field full-width-text-field">
      <input
          ref="intervalDaysInput"
          @keyup.enter="$emit('submit')"
          :value="value.intervalDays"
          @input="emitInput"
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

    <div
        v-if="rule === 'monthly'"
        class="mdc-text-field full-width-text-field">
      <input
          ref="monthlyDayInput"
          @keyup.enter="$emit('submit')"
          v-model="monthlyDay"
          @input="emitInput"
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

    <div
        v-if="rule === 'monthlyweekday'"
        class="mdc-text-field full-width-text-field">
      <input
          ref="monthlyweekdayNthInput"
          @keyup.enter="$emit('submit')"
          v-model="monthlyweekdayNth"
          @input="emitInput"
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

    <div
        v-if="rule === 'monthlyweekday'"
        class="mdc-select full-width-text-field">
      <select
          ref="monthlyweekdayWeekdayInput"
          id="series-monthlyweekday-weekday"
          :value="value.monthlyweekdayWeekday"
          @change="emitInput"
          @input="emitInput"
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

    <div
        v-if="rule === 'monthly' || rule === 'monthlyweekday'"
        class="mdc-text-field full-width-text-field">
      <input
          ref="monthlyMonthsInput"
          @keyup.enter="$emit('submit')"
          :value="value.monthlyMonths"
          @input="emitInput"
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

    <div
        class="mdc-text-field full-width-text-field">
      <input
          ref="startInput"
          @keyup.enter="$emit('submit')"
          :value="value.start"
          @input="emitInput"
          id="series-start"
          type="date"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="series-start">
        starting on
      </label>
    </div>

    <div
        class="mdc-text-field full-width-text-field">
      <input
          ref="endInput"
          @keyup.enter="$emit('submit')"
          :value="value.end"
          @input="emitInput"
          id="series-end"
          type="date"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="series-end">
        until
      </label>
    </div>

  </form>
</template>

<script>
import { MDCSelect } from '@material/select'

import { formatDayString } from '@/utils'

export default {
  name: 'TaskChunkSeriesForm',
  props: {
    value: {
      type: Object,
      default () {
        return {
          rule: '',
          start: formatDayString(new Date()),
          end: '',
          intervalDays: '1',
          monthlyDay: '1',
          monthlyMonths: '1',
          monthlyweekdayWeekday: '0',
          monthlyweekdayNth: '1'
        }
      }
    }
  },
  data: function () {
    return {
      ui: {
        ruleInput: null
      },
      rule: this.value.rule,
      monthlyDay: this.value.monthlyDay,
      monthlyweekdayNth: this.value.weekdayNth
    }
  },
  mounted: function () {
    if (this.ui.ruleInput === null) {
      this.ui.ruleInput = new MDCSelect(this.$refs.rule)
    }
  },
  methods: {
    emitInput () {
      let data = {
        rule: this.rule,
        start: this.$refs.startInput.value,
        end: this.$refs.endInput.value
      }
      if (this.$refs.intervalDaysInput !== undefined) {
        data.intervalDays = this.$refs.intervalDaysInput.value
      }
      if (this.$refs.monthlyDayInput !== undefined) {
        data.monthlyDay = this.$refs.monthlyDayInput.value
      }
      if (this.$refs.monthlyMonthsInput !== undefined) {
        data.monthlyMonths = this.$refs.monthlyMonthsInput.value
      }
      if (this.$refs.monthlyweekdayWeekdayInput !== undefined) {
        data.monthlyweekdayWeekday = this.$refs.monthlyweekdayWeekdayInput.value
      }
      if (this.$refs.monthlyweekdayNthInput !== undefined) {
        data.monthlyweekdayNth = this.$refs.monthlyweekdayNthInput.value
      }
      this.$emit('input', data)
    }
  }
}
</script>
