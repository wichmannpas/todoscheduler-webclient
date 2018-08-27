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
    </p>
  </form>
</template>

<script>
import { textField } from 'material-components-web'

import { formatDayString } from '@/utils'

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
        durationInput: null
      }
    }
  },
  mounted: function () {
    if (this.ui.nameInput === null) {
      this.ui.nameInput = new textField.MDCTextField(this.$refs.name)
    }
    if (this.ui.durationInput === null) {
      this.ui.durationInput = new textField.MDCTextField(this.$refs.duration)
    }

    if (this.autofocus) {
      this.$refs.nameInput.focus()
    }
  },
  computed: {
    startString () {
      if (this.value.start === null) {
        return null
      }
      return formatDayString(this.value.start)
    }
  },
  methods: {
    updateTask () {
      let start = this.$refs.startInput.value
      if (start === '') {
        start = null
      }
      this.$emit('input', {
        name: this.$refs.nameInput.value,
        duration: this.$refs.durationInput.value,
        start: start
      })
    }
  }
}
</script>
