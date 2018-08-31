<template>
  <form
      @submit.prevent="$emit('submit')">
    <div
        ref="name"
        class="mdc-text-field full-width-text-field">
      <input
          id="task-name"
          ref="nameInput"
          :value="value.name"
          @input="updateTask"
          @keyup.enter="$emit('submit')"
          v-bind:disabled="loading"
          type="text"
          class="mdc-text-field__input"
          maxlength="40" />
      <label
          class="mdc-floating-label"
          for="task-name">
        Name
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('name') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This task name is invalid.
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
          :value="value.duration"
          @input="updateTask"
          @keyup.enter="$emit('submit')"
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
        ref="priority"
        class="mdc-slider mdc-slider--discrete"
        tabindex="0"
        role="slider"
        aria-valuemin="0"
        aria-valuemax="10"
        :aria-valuenow="value.priority"
        aria-label="Task Priority">
      <div class="mdc-slider__track-container">
        <div class="mdc-slider__track"></div>
      </div>
      <div class="mdc-slider__thumb-container">
        <div class="mdc-slider__pin">
          <span class="mdc-slider__pin-value-marker"></span>
        </div>
        <svg class="mdc-slider__thumb" width="21" height="21">
          <circle cx="10.5" cy="10.5" r="7.875"></circle>
        </svg>
        <div class="mdc-slider__focus-ring"></div>
      </div>
      <label
          class="mdc-floating-label mdc-floating-label--float-above">
        Priority
      </label>
    </div>
    {{ priorityString }}

    <div
        ref="start"
        class="
          mdc-text-field
          full-width-text-field">
      <input
          id="task-start"
          ref="startInput"
          :value="startString"
          @input="updateTask"
          @keyup.enter="$emit('submit')"
          :disabled="loading"
          type="date"
          class="
            mdc-text-field__input" />
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="task-start">
        Start
      </label>
    </div>
    <p
        v-if="errors.indexOf('start') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This start date is invalid.
      <span v-if="errors.indexOf('deadline') >= 0">
        Please make sure that it is not after the deadline.
      </span>
    </p>

    <div
        ref="deadline"
        class="
          mdc-text-field
          full-width-text-field">
      <input
          id="task-deadline"
          ref="deadlineInput"
          :value="deadlineString"
          @input="updateTask"
          @keyup.enter="$emit('submit')"
          :disabled="loading"
          type="date"
          class="
            mdc-text-field__input" />
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="task-deadline">
        Deadline
      </label>
    </div>
    <p
        v-if="errors.indexOf('deadline') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This deadline is invalid.
      <span v-if="errors.indexOf('start') >= 0">
        Please make sure that it is not before the start date.
      </span>
    </p>
  </form>
</template>

<script>
import { slider, textField } from 'material-components-web'

import { formatDayString, priorityString } from '@/utils'

export default {
  name: 'TaskForm',
  props: [
    'value',
    'loading',
    'errors',
    'autofocus'
  ],
  data: function () {
    return {
      ui: {
        nameInput: null,
        durationInput: null,
        prioritySlider: null
      },
      priority: this.value.priority
    }
  },
  mounted: function () {
    if (this.ui.nameInput === null) {
      this.ui.nameInput = new textField.MDCTextField(this.$refs.name)
    }
    if (this.ui.durationInput === null) {
      this.ui.durationInput = new textField.MDCTextField(this.$refs.duration)
    }
    if (this.ui.prioritySlider === null) {
      this.ui.prioritySlider = new slider.MDCSlider(this.$refs.priority)
      this.ui.prioritySlider.listen('MDCSlider:change', () => this.updateTask())
    }

    if (this.autofocus) {
      this.$refs.nameInput.focus()
    }
  },
  computed: {
    deadlineString () {
      if (this.value.deadline === null) {
        return null
      }
      return formatDayString(this.value.deadline)
    },
    startString () {
      if (this.value.start === null) {
        return null
      }
      return formatDayString(this.value.start)
    },
    priorityString () {
      return priorityString(this.priority)
    }
  },
  methods: {
    updateTask () {
      let deadline = this.$refs.deadlineInput.value
      if (deadline === '') {
        deadline = null
      }
      let start = this.$refs.startInput.value
      if (start === '') {
        start = null
      }
      this.priority = parseInt(this.$refs.priority.getAttribute('aria-valuenow'))
      this.$emit('input', {
        name: this.$refs.nameInput.value,
        duration: this.$refs.durationInput.value,
        priority: this.priority,
        deadline: deadline,
        start: start
      })
    }
  }
}
</script>
