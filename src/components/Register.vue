<template>
  <form
      @submit.prevent="register"
      class="form-horizontal">
    <p>
      If you do not have an account yet, use this form to create one.
      You will need to choose a username and a password to register.
      Registration and usage of this service is completely free.
    </p>

    <div
        ref="username"
        class="mdc-text-field mdc-text-field--box full-width-text-field">
      <input
          id="register-username"
          type="text"
          :disabled="registerSuccess"
          :class="{
            'mdc-text-field--disabled': registerSuccess
          }"
          class="mdc-text-field__input"
          v-model="user.username" />
      <label
          class="mdc-floating-label"
          for="register-username">
        Username
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.username && errors.username.tooShort"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This username is too short. It may not have less than one character.
    </p>
    <p
        v-else-if="errors.username && errors.username.tooLong"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This username is too long. It may not have more than 150 characters.
    </p>
    <p
        v-else-if="errors.username && errors.username.taken"
        class="
          mdc-text-field-helper-text
          mdc-text-field-helper-text--validation-msg
          mdc-text-field-helper-text--persistent
          error">
      This username is already taken.
    </p>
    <p
        v-else
        class="mdc-text-field-helper-text"
        aria-hidden="true">
      You will need your username to login.
    </p>

    <div
        ref="password"
        class="mdc-text-field mdc-text-field--box full-width-text-field">
      <input
          id="register-password"
          type="password"
          :disabled="registerSuccess"
          :class="{
            'mdc-text-field--disabled': registerSuccess
          }"
          class="mdc-text-field__input"
          v-model="user.password" />
      <label
          class="mdc-floating-label"
          for="register-password">
        Password
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.password && errors.password.tooShort"
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
        class="mdc-text-field mdc-text-field--box full-width-text-field">
      <input
          id="register-password2"
          type="password"
          :disabled="registerSuccess"
          :class="{
            'mdc-text-field--disabled': registerSuccess
          }"
          class="mdc-text-field__input"
          v-model="user.password2" />
      <label
          class="mdc-floating-label"
          for="register-password2">
        Password <em>(repeat)</em>
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p
        v-if="errors.password2 && errors.password2.doesNotMatch"
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
          ref="register"
          type="submit"
          class="mdc-button mdc-button--raised"
          :disabled="loading || registerSuccess">
        Register
      </button>
    </div>
  </form>
</template>

<script>
import { MDCRipple } from '@material/ripple'
import { MDCTextField } from '@material/textfield'

import { login, register } from '@/api/auth'
import Loading from '@/components/Loading'
import { showSnackbar } from '@/snackbar'

export default {
  name: 'Register',
  components: {
    Loading
  },
  data: () => {
    return {
      ui: {
        usernameInput: null,
        passwordInput: null,
        password2Input: null,
        registerButton: null
      },
      registerSuccess: false,
      errors: {},
      loading: false,
      user: {
        username: '',
        password: '',
        password2: ''
      }
    }
  },
  mounted: function () {
    if (this.ui.usernameInput === null) {
      this.ui.usernameInput = new MDCTextField(this.$refs.username)
    }
    if (this.ui.passwordInput === null) {
      this.ui.passwordInput = new MDCTextField(this.$refs.password)
    }
    if (this.ui.password2Input === null) {
      this.ui.password2Input = new MDCTextField(this.$refs.password2)
    }

    if (this.ui.registerButton === null) {
      this.ui.registerButton = new MDCRipple(this.$refs.register)
    }
  },
  methods: {
    register () {
      if (this.loading) {
        return
      }

      this.errors = {}

      if (this.user.username.length < 1) {
        this.errors.username = {
          tooShort: true
        }
      } else if (this.user.username.length > 150) {
        this.errors.username = {
          tooLong: true
        }
      }
      if (this.user.password.length < 6) {
        this.errors.password = {
          tooShort: true
        }
      }
      if (this.user.password2 !== this.user.password) {
        this.errors.password2 = {
          doesNotMatch: true
        }
      }
      if (Object.keys(this.errors).length > 0) {
        return
      }

      this.loading = true

      register(this.user.username, this.user.password).then(() => {
        this.registerSuccess = true
        showSnackbar({
          message: 'Your account was successfully registered. ' +
            'You will be logged in automatically in a few seconds.',
          multiline: true
        })
        setTimeout(() => {
          login(this.user.username, this.user.password).then(() => {
            this.$router.push({
              name: 'main'
            })
          }).catch((error) => {
            console.error(error.message)
          })
        }, 2000)
      }).catch((error) => {
        if (error.message.substr(0, 4) === 'JSON') {
          error = JSON.parse(error.message.substr(4))
          Object.keys(error).forEach(key => {
            this.errors[key] = {}
            error[key].forEach(message => {
              if (message === 'A user with that username already exists.') {
                this.errors[key].taken = true
              }
            })
          })
        } else {
          showSnackbar({
            message: 'There was a problem while trying to connect to the server.'
          })
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
