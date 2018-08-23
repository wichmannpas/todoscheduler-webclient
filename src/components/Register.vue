<template>
  <form
      @submit.prevent="register"
      class="form-horizontal">
    <h3>
      Register
    </h3>

    <p>
      Choose a username and a password to register.
    </p>

    <div class="form-group"
          :class="[
            { 'has-error': errors.username }
          ]">
      <label class="form-label" for="register-username">Username</label>
      <input
          id="register-username"
          name="username"
          v-model="user.username"
          @keydown="registerFailure = false"
          type="text"
          class="form-input"
          :disabled="registerSuccess"
          placeholder="Username" />
      <p
          v-if="errors.username && errors.username.tooShort"
          class="form-input-hint">
        This username is too short. It may not have less than one character.
      </p>
      <p
          v-if="errors.username && errors.username.tooLong"
          class="form-input-hint">
        This username is too long. It may not have more than 150 characters.
      </p>
      <p
          v-if="errors.username && errors.username.taken"
          class="form-input-hint">
        This username is already taken.
      </p>
    </div>

    <div class="form-group"
          :class="[
            { 'has-error': errors.password }
          ]">
      <label class="form-label" for="register-password">Password</label>
      <input
          id="register-password"
          name="password"
          v-model="user.password"
          @keydown="registerFailure = false"
          type="password"
          class="form-input"
          :disabled="registerSuccess"
          placeholder="Password" />
      <p
          v-if="errors.password && errors.password.tooShort"
          class="form-input-hint">
        This password is too short. It may not have less than 6 characters.
      </p>
    </div>

    <div class="form-group"
          :class="[
            { 'has-error': errors.password2 }
          ]">
      <label class="form-label" for="register-password2">Password <em>(repeat)</em></label>
      <input
          id="register-password2"
          name="password"
          v-model="user.password2"
          @keydown="registerFailure = false"
          type="password"
          class="form-input"
          :disabled="registerSuccess"
          placeholder="Password (repeat)" />
      <p
          v-if="errors.password2 && errors.password2.doesNotMatch"
          class="form-input-hint">
        This password does not match the first one.
      </p>
    </div>

    <div
        class="loading loading-lg"
        v-if="loading">
    </div>

    <div
        class="toast toast-error"
        v-if="connectFailure">
      There was a problem while trying to connect to the server.
    </div>

    <div
        class="toast toast-success"
        v-if="registerSuccess">
      Your account was successfully registered.
      You will be logged in automatically in a few seconds.
    </div>

    <div class="btn-group btn-group-block">
      <input
          type="submit"
          class="btn btn-primary"
          value="Register"
          :disabled="loading || registerSuccess" />
    </div>
  </form>
</template>

<script>
import { login, register } from '@/api/auth'

export default {
  name: 'Register',
  data: () => {
    return {
      registerFailure: false,
      registerSuccess: false,
      errors: {},
      connectFailure: false,
      loading: false,
      user: {
        username: '',
        password: '',
        password2: ''
      }
    }
  },
  methods: {
    register () {
      if (this.loading) {
        return
      }

      this.connectFailure = false
      this.errors = {}

      if (this.user.username.length < 1) {
        this.errors.username = {
          tooShort: true
        }
      } else if (this.user.username.length > 17) {
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

      if (this.registerFailure) {
        // no change since last attempt
        return
      }

      this.loading = true

      register(this.user.username, this.user.password).then(() => {
        this.registerSuccess = true
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
          this.registerFailure = true
        } else {
          this.connectFailure = true
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
