<template>
  <form
      @submit.prevent="login">
    <p>
      Please provide your credentials to log in.
    </p>

    <div
        ref="username"
        class="mdc-text-field mdc-text-field--box full-width-text-field">
      <input
          id="login-username"
          type="text"
          class="mdc-text-field__input"
          v-model="user.username" />
      <label
          class="mdc-floating-label"
          for="login-username">
        Username
      </label>
      <div class="mdc-line-ripple"></div>
    </div>
    <div
        ref="password"
        class="mdc-text-field mdc-text-field--box full-width-text-field">
      <input
          id="login-password"
          type="password"
          class="mdc-text-field__input"
          v-model="user.password" />
      <label
          class="mdc-floating-label"
          for="login-password">
        Password
      </label>
      <div class="mdc-line-ripple"></div>
    </div>

    <Loading
        v-if="loading" />

    <div class="button-container">
      <button
          ref="login"
          type="submit"
          class="mdc-button mdc-button--raised"
          :disabled="loading">
        Login
      </button>
    </div>
  </form>
</template>

<script>
import { MDCRipple } from '@material/ripple'
import { MDCTextField } from '@material/textfield'

import { login } from '@/api/auth'
import Loading from '@/components/Loading'
import { showSnackbar } from '@/snackbar'

export default {
  name: 'Login',
  components: {
    Loading
  },
  data: function () {
    return {
      ui: {
        usernameInput: null,
        passwordInput: null,
        loginButton: null
      },
      loading: false,
      user: {
        username: '',
        password: ''
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

    if (this.ui.loginButton === null) {
      this.ui.loginButton = new MDCRipple(this.$refs.login)
    }
  },
  methods: {
    login () {
      this.loading = true
      login(this.user.username, this.user.password).then(
        () => {
          console.log('successfully authenticated')
          this.$router.push({ name: 'main' })
        }
      ).catch(error => {
        if (error.message === 'invalid credentials') {
          showSnackbar({
            message: 'Login with the provided credentials failed.'
          })
        } else {
          console.warn(error)
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
