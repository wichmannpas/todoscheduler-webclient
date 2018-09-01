<template>
  <form
      @submit.prevent="$emit('submit')">
    <div
        ref="title"
        class="mdc-text-field full-width-text-field">
      <input
          id="label-title"
          ref="titleInput"
          :value="value.title"
          @input="updateLabel"
          @keyup.enter="$emit('submit')"
          :disabled="loading"
          type="text"
          class="mdc-text-field__input"
          maxlength="15" />
      <label
          class="mdc-floating-label"
          for="label-title">
        Title
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('title') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This label title is invalid.
    </p>

    <div
        ref="description"
        class="
          mdc-text-field
          full-width-text-field">
      <input
          id="label-description"
          ref="descriptionInput"
          :value="value.description"
          @input="updateLabel"
          @keyup.enter="$emit('submit')"
          :disabled="loading"
          type="text"
          class="
            mdc-text-field__input" />
      <label
          class="mdc-floating-label"
          for="label-description">
        Description
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('description') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This description is invalid.
    </p>

    <div
        ref="color"
        class="
          mdc-text-field
          full-width-text-field">
      <input
          id="label-color"
          ref="colorInput"
          :value="'#' + value.color"
          @input="updateLabel"
          @keyup.enter="$emit('submit')"
          :disabled="loading"
          type="color"
          class="
            mdc-text-field__input" />
      <label
          class="mdc-floating-label"
          for="label-color">
        Color
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('color') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This is not a valid color.
    </p>

  </form>
</template>

<script>
import { textField } from 'material-components-web'

import { formatDayString, priorityString } from '@/utils'

export default {
  name: 'LabelForm',
  props: [
    'value',
    'loading',
    'errors',
    'autofocus'
  ],
  data: function () {
    return {
      ui: {
        titleInput: null,
        descriptionInput: null,
        colorInput: null
      },
      priority: this.value.priority
    }
  },
  mounted: function () {
    if (this.ui.titleInput === null) {
      this.ui.titleInput = new textField.MDCTextField(this.$refs.title)
    }
    if (this.ui.descriptionInput === null) {
      this.ui.descriptionInput = new textField.MDCTextField(this.$refs.description)
    }
    if (this.ui.colorInput === null) {
      this.ui.colorInput = new textField.MDCTextField(this.$refs.color)
    }

    if (this.autofocus) {
      this.$refs.titleInput.focus()
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
    updateLabel () {
      this.$emit('input', {
        title: this.$refs.titleInput.value,
        description: this.$refs.descriptionInput.value,
        color: this.$refs.colorInput.value.substring(1)
      })
    }
  }
}
</script>
