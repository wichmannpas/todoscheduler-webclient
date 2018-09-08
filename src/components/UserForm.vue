<template>
  <form
      @submit.prevent="updateSettings">
    <div
        class="mdc-text-field mdc-text-field--disabled full-width-text-field">
      <input
          id="user-username"
          v-model="editedUser.username"
          type="text"
          class="mdc-text-field__input"
          disabled />
      <label
          class="mdc-floating-label mdc-floating-label--float-above"
          for="user-username">
        Username
      </label>
      <div class="mdc-line-ripple"></div>
    </div>

    <div
        ref="workhoursWeekday"
        class="mdc-text-field full-width-text-field">
      <input
          id="user-workhoursWeekday"
          ref="workhoursWeekdayInput"
          v-model="editedUser.workhoursWeekday"
          type="number"
          step="0.01"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label"
          for="user-workhoursWeekday">
        Hours of daily work on weekdays
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('workhours_weekday') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This value is invalid.
    </p>

    <div
        ref="workhoursWeekend"
        class="mdc-text-field full-width-text-field">
      <input
          id="user-workhoursWeekend"
          ref="workhoursWeekendInput"
          v-model="editedUser.workhoursWeekend"
          type="number"
          step="0.01"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label"
          for="user-workhoursWeekend">
        Hours of daily work during weekends
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('workhours_weekend') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This value is invalid.
    </p>

    <div
        ref="defaultScheduleDuration"
        class="mdc-text-field full-width-text-field">
      <input
          id="user-defaultScheduleDuration"
          ref="defaultScheduleDurationInput"
          v-model="editedUser.defaultScheduleDuration"
          type="number"
          step="0.01"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label"
          for="user-defaultScheduleDuration">
        Default duration to schedule
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('default_schedule_duration') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This value is invalid.
    </p>

    <div
        ref="defaultScheduleFullDurationMax"
        class="mdc-text-field full-width-text-field">
      <input
          id="user-defaultScheduleFullDurationMax"
          ref="defaultScheduleFullDurationMaxInput"
          v-model="editedUser.defaultScheduleFullDurationMax"
          type="number"
          step="0.01"
          class="mdc-text-field__input" />
      <label
          class="mdc-floating-label"
          for="user-defaultScheduleFullDurationMax">
        Maximum unscheduled duration to suggest for scheduling
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('default_schedule_full_duration_max') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This value is invalid.
    </p>

    <Loading v-if="loading" />

    <div class="button-container">
      <button
          ref="submit"
          type="submit"
          class="mdc-button mdc-button--raised"
          :disabled="loading">
        Save settings
      </button>
    </div>
  </form>
</template>

<script>
import { MDCRipple } from '@material/ripple'
import { MDCTextField } from '@material/textfield'

import Loading from '@/components/Loading'
import User from '@/models/User'
import { updateUser } from '@/api/user'
import { showSnackbar } from '@/snackbar'

export default {
  name: 'UserForm',
  props: [
    'user'
  ],
  components: {
    Loading
  },
  data: function () {
    return {
      loading: false,
      editedUser: Object.assign(new User(), this.user),
      errors: [],
      ui: {
        submitButton: null,
        defaultScheduleDurationInput: null,
        defaultScheduleFullDurationMaxInput: null,
        workhoursWeekdayInput: null,
        workhoursWeekendInput: null
      }
    }
  },
  mounted: function () {
    if (this.ui.defaultScheduleDurationInput === null) {
      this.ui.defaultScheduleDurationInput = new MDCTextField(this.$refs.defaultScheduleDuration)
    }
    if (this.ui.defaultScheduleFullDurationMaxInput === null) {
      this.ui.defaultScheduleFullDurationMaxInput = new MDCTextField(this.$refs.defaultScheduleFullDurationMax)
    }
    if (this.ui.workhoursWeekdayInput === null) {
      this.ui.workhoursWeekdayInput = new MDCTextField(this.$refs.workhoursWeekday)
    }
    if (this.ui.workhoursWeekendInput === null) {
      this.ui.workhoursWeekendInput = new MDCTextField(this.$refs.workhoursWeekend)
    }

    if (this.ui.submitButton === null) {
      this.ui.submitButton = new MDCRipple(this.$refs.submit)
    }
  },
  methods: {
    updateSettings () {
      this.errors = []
      this.loading = true
      updateUser(this.editedUser).then(user => {
        this.$store.commit('setUser', user)

        showSnackbar({
          message: 'Settings updated.'
        })
      }).catch(error => {
        this.errors = Object.keys(error)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
