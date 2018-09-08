<template>
  <form
      @submit.prevent="updatePassword">
    <div
        ref="password"
        class="mdc-text-field full-width-text-field">
      <input
          id="user-password"
          type="password"
          class="mdc-text-field__input"
          v-model="editedUser.password" />
      <label
          class="mdc-floating-label"
          for="user-password">
        Password
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('password') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This password is too short. It may not have less than 6 characters.
    </p>
    <p
        v-else
        class="mdc-text-field-helper-text"
        aria-hidden="true">
      Choose a strong password to protect your account.
    </p>

    <div
        ref="password2"
        class="mdc-text-field full-width-text-field">
      <input
          id="user-password2"
          type="password"
          class="mdc-text-field__input"
          v-model="editedUser.password2" />
      <label
          class="mdc-floating-label"
          for="user-password2">
        Password <em>(repeat)</em>
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.indexOf('password2') >= 0"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This password does not match the first one.
    </p>
    <p
        v-else
        class="mdc-text-field-helper-text"
        aria-hidden="true">
      Repeat your password to make sure that you have spelled it correctly.
    </p>

    <Loading v-if="loading" />

    <div class="button-container">
      <button
          ref="submit"
          type="submit"
          class="mdc-button mdc-button--raised"
          :disabled="loading">
        Update password
      </button>
    </div>
  </form>
</template>

<script>
import { MDCRipple } from '@material/ripple'
import { MDCTextField } from '@material/textfield'

import Loading from '@/components/Loading'
import { updateUser } from '@/api/user'
import { showSnackbar } from '@/snackbar'

export default {
  name: 'ChangePasswordForm',
  props: [
    'user'
  ],
  components: {
    Loading
  },
  data: function () {
    return {
      loading: false,
      editedUser: {
        password: '',
        password2: ''
      },
      errors: [],
      ui: {
        submitButton: null,
        passwordInput: null,
        password2Input: null
      }
    }
  },
  mounted: function () {
    if (this.ui.passwordInput === null) {
      this.ui.passwordInput = new MDCTextField(this.$refs.password)
    }
    if (this.ui.password2Input === null) {
      this.ui.password2Input = new MDCTextField(this.$refs.password2)
    }

    if (this.ui.submitButton === null) {
      this.ui.submitButton = new MDCRipple(this.$refs.submit)
    }
  },
  methods: {
    updatePassword () {
      this.errors = []

      if (this.editedUser.password.length < 6) {
        this.errors.push('password')
      }
      if (this.editedUser.password !== this.editedUser.password2) {
        this.errors.push('password2')
      }

      if (this.errors.length > 0) {
        // do not submit invalid data
        return
      }

      this.loading = true
      updateUser({
        password: this.editedUser.password
      }).then(user => {
        this.$store.commit('setUser', user)

        this.editedUser.password = this.editedUser.password2 = ''

        showSnackbar({
          message: 'Password changed.'
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
