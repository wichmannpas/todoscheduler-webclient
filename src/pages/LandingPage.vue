<template>
  <div class="container-slim">
    <h4
        class="mdc-typography mdc-typography--headline4">
      Login
    </h4>
    <Login />

    <h4
        class="mdc-typography mdc-typography--headline4">
      Register
    </h4>
    <Register />
  </div>
</template>

<script>
import { checkAuth } from '@/api'
import Login from '@/components/Login'
import Register from '@/components/Register'

export default {
  name: 'LandingPage',
  components: {
    Login,
    Register
  },
  created: function () {
    // TODO: do not explicitly check auth here but rely on store to check authentication
    checkAuth().then((auth) => {
      if (auth) {
        this.$router.push({ name: 'main' })
      }
    })
  }
}
</script>
