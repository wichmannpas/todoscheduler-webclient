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
import Login from '@/components/Login'
import Register from '@/components/Register'

export default {
  name: 'LandingPage',
  components: {
    Login,
    Register
  }
}
</script>
